import { LitElement, html, css } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import 'd2l-table/d2l-table.js';
import { OutcomeActivityCollectionEntity } from '../entities/OutcomeActivityCollectionEntity';

export class MasteryViewUserOutcomeCell extends LocalizeMixin(EntityMixinLit(LitElement)) {
	static get is() { return 'd2l-mastery-view-user-outcome-cell'; }

	static get properties() {
		return {
			_cellData: Object
		};
	}

	static get styles() {
		return css`
			.cell-content-container:focus {
				outline-color: var(--d2l-color-celestine);
			}

			#assessment-fraction-container {
				line-height: 12px;
			}

			#assessment-fraction {
				display: inline-block;
				padding-left: 6px;
				padding-top: 6px;
				padding-right: 6px;
				font-family: 'Lato', sans-serif;
				font-size: 12px;
				color: var(--d2l-color-tungsten)
			}

			.assessment-level-label {
				@apply --d2l-body-compact-text;
				display: inline-block;
				line-height: 24px;
				padding-left: 30px;
				padding-bottom: 18px;
			}

			:host([dir="rtl"]) .assessment-level-label {
				padding-right: 30px;
				padding-left: 0px;

			}
			.override-indicator {
				display: inline-block;
				line-height: 24px;
				padding-bottom: 18px;
				font-family: 'Lato', sans-serif;
				font-size: 20px;
			}

			.assessment-outdated-icon {
				display: inline-block;
				float: right;
				padding-right: 6px;
				padding-top: 3px;
			}

			:host([dir="rtl"]) .assessment-outdated-icon {
				float: left;
				padding-left: 6px;
				padding-right: 0px;
			}

			.assessment-publish-status-img {
				display: inline-block;
				float: right;
				padding-right: 9px;
				padding-top: 6px;
			}

			:host([dir="rtl"]) .assessment-publish-status-img {
				float: left;
				padding-left: 9px;
				padding-right: 0px;
			}

		`;
	}

	constructor() {
		super();
		this._setEntityType(OutcomeActivityCollectionEntity);
	}

	render() {
		const data = this._cellData;
		if (!data) {
			//TODO: create loading skeleton to render in place of cell content
			return null;
		}
		return html`

		<div class="cell-content-container" tabindex="0" style="background-color:${data.levelColor}">
			<div id="assessment-fraction-container">
				<span id="assessment-fraction">
					${data.totalEvaluatedAssessments}/${data.totalAssessments}
				</span>
			</div>
			<div class="assessment-level-label">${data.levelName}</div>
			${data.isManualOverride ? html`
				<div class="override-indicator"><b>*</b></div>
			` : null}

			<div class="assessment-publish-status-img">
				${data.published ? this._renderPublishedIcon() : this._renderNotPublishedIcon() }
			</div>
			${data.outdated ? html`
				<d2l-icon class="assessment-outdated-icon" icon="tier1:refresh"></d2l-icon>
			` : null}

		</div>
		<d2l-tooltip
			id="tooltip"
			for="assessment-fraction"
			position="top"
			align="start"
		>
			${this._getTooltipText(data.totalAssessments, data.totalEvaluatedAssessments)}
		</d2l-tooltip>
		`;
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	_getTooltipText(totalActivities, totalAssessed) {
		return this.localize('tooltipUserOutcomeAssessments', 'numAssessed', totalAssessed, 'numTotal', totalActivities);
	}

	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}
		let name, color, hasOverallDemonstration, overallAssessmentDate, mostRecentAssessmentDate, hasManualOverride, isPublished, isOutOfDate;
		let assessmentCount = 0;
		let assessmentWithDemonstrationCount = 0;
		entity.onActivityChanged(activity => {
			if (!activity) {
				return;
			}
			//Check if the activity is a checkpoint item, then fill in appropriate information
			if (activity.getType() === 'Checkpoint') {
				activity.onAssessedDemonstrationChanged(demonstration => {
					hasOverallDemonstration = true;
					const demonstratedLevel = demonstration.getDemonstratedLevel();
					hasManualOverride = demonstratedLevel.isManualOverride();
					overallAssessmentDate = demonstration.getDateAssessed();
					isPublished = demonstration.isPublished();
					demonstratedLevel.onLevelChanged(loa => {
						name = loa.getName();
						color = loa.getColor();
					});
				});
			}
			else {
				assessmentCount++;
				activity.onAssessedDemonstrationChanged(demonstration => {
					assessmentWithDemonstrationCount++;
					const assessmentDate = demonstration.getDateAssessed();
					if (!mostRecentAssessmentDate || assessmentDate > mostRecentAssessmentDate) {
						mostRecentAssessmentDate = assessmentDate;
					}
				});
			}
		});

		entity.subEntitiesLoaded().then(() => {
			if (hasOverallDemonstration) {
				isOutOfDate = (mostRecentAssessmentDate && mostRecentAssessmentDate > overallAssessmentDate);
			}
			else {
				name = '-';
				color = '#FFFFFF';
				isPublished = false;
				isOutOfDate = false;
				hasManualOverride = false;
			}
			this._cellData = {
				totalAssessments: assessmentCount,
				totalEvaluatedAssessments: assessmentWithDemonstrationCount,
				levelName: name,
				levelColor: color + '1A',
				isManualOverride: hasManualOverride,
				outdated: isOutOfDate,
				published: isPublished
			};
		});
	}

	_renderNotPublishedIcon() {
		return html`
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="11.9" viewBox="0 0 14 11.9">
			<defs>
				<clipPath id="clip-path">
					<path id="Path_8" data-name="Path 8" d="M12.657-11.707a1,1,0,0,1,0,1.414l-9.9,9.9a1,1,0,0,1-1.414,0,1,1,0,0,1,0-1.414l9.9-9.9A1,1,0,0,1,12.657-11.707Zm-.272,3.1A3.215,3.215,0,0,1,14-6.05c0,2.209-3.134,4-7,4-.381,0-.755-.017-1.12-.051l.955-.954L7-3.05a3,3,0,0,0,3-3l-.006-.166ZM7-10.05c.382,0,.756.017,1.121.051l-.955.954L7-9.05a3,3,0,0,0-3,3l.005.166-2.39,2.39A3.215,3.215,0,0,1,0-6.05C0-8.259,3.134-10.05,7-10.05Z" fill="none" clip-rule="evenodd"/>
				</clipPath>
			</defs>
			<g id="Visibility-hide-small" transform="translate(0 12)" clip-path="url(#clip-path)">
				<path id="Path_5" data-name="Path 5" d="M12.657.293a1,1,0,0,1,0,1.414l-9.9,9.9a1,1,0,0,1-1.414-1.414l9.9-9.9A1,1,0,0,1,12.657.293Zm-.272,3.1A3.215,3.215,0,0,1,14,5.95c0,2.209-3.134,4-7,4-.381,0-.755-.017-1.12-.051l.955-.954L7,8.95a3,3,0,0,0,3-3l-.006-.166ZM7,1.95c.382,0,.756.017,1.121.051l-.955.954L7,2.95a3,3,0,0,0-3,3l.005.166-2.39,2.39A3.215,3.215,0,0,1,0,5.95C0,3.741,3.134,1.95,7,1.95Z" transform="translate(0 -12)" fill="none" stroke="#6d7376" stroke-width="4"/>
				<path id="Path_6" data-name="Path 6" d="M0,0H14V-12H0Z" fill="none"/>
				<path id="Path_7" data-name="Path 7" d="M-1,1H15V-13H-1Z" fill="none"/>
			</g>
		</svg>
		`;
	}

	_renderPublishedIcon() {
		return html`
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="11.9" viewBox="0 -2 14 11.9">
			<path id="Visibility-show-small" d="M8,3c3.866,0,7,1.791,7,4s-3.134,4-7,4S1,9.209,1,7,4.134,3,8,3ZM8,4a3,3,0,1,0,3,3A3,3,0,0,0,8,4ZM8,6A1,1,0,1,1,7,7,1,1,0,0,1,8,6Z" transform="translate(-1 -3)" fill="#6e7376" fill-rule="evenodd"/>
		</svg>
		`;
	}
}

customElements.define(MasteryViewUserOutcomeCell.is, MasteryViewUserOutcomeCell);
