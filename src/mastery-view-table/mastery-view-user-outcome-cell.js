import { LitElement, html, css } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import 'd2l-table/d2l-table.js';
import { OutcomeActivityCollectionEntity } from '../entities/OutcomeActivityCollectionEntity';
import '../custom-icons/visibility-hide.js';
import '../custom-icons/visibility-show.js';

const KEYCODES = {
	ENTER: 13,
	SPACE: 32
};

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

			.cell-content-container {
				width: 198px;
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

			.assessment-label-container {
				display: inline-block;
				padding-left: 30px;
				padding-bottom: 18px;
			}

			:host([dir="rtl"]) .assessment-label-container {
				padding-right: 30px;
				padding-left: 0px;
			}

			.assessment-level-label {
				@apply --d2l-body-compact-text;
				float: left;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 100px;
				line-height: 24px;
			}

			:host([dir="rtl"]) .assessment-level-label {
				float: right;
			}

			.cell-content-container:hover .assessment-level-label {
				text-decoration: underline;
			}

			:host([dir="rtl"]) .override-indicator {
				float: right;
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

			.assessment-publish-status-icon {
				display: inline-block;
				float: right;
				padding-right: 9px;
				padding-top: 6px;
			}

			:host([dir="rtl"]) .assessment-publish-status-icon {
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
		<div
			class="cell-content-container"
			tabindex="0"
			style="background-color:${data.levelColor}"
			@click=${() => { this._onClick(); }}
			@keydown=${(e) => { this._onKeyDown(e); }}
			aria-label="${this._getAriaText(data)}"
		>
			<div id="assessment-fraction-container" aria-hidden="true">
				<span id="assessment-fraction">
					${data.totalEvaluatedAssessments}/${data.totalAssessments}
				</span>
			</div>
			<div class="assessment-label-container" aria-hidden="true">
				<div class="assessment-level-label" title="${data.levelName}">
					${data.levelName}
				</div>
				${data.isManualOverride ? html`
					<span class="override-indicator" title="Manual override"><b>*</b></span>
				` : null}
			</div>
			<div
				class="assessment-publish-status-icon"
				aria-hidden="true"
				title="${data.published ? 'Published' : 'Not published'}"
			>
				${data.published ? html`<d2l-icon-visibility-show />` : html`<d2l-icon-visibility-hide />`}
			</div>
			${data.outdated ? html`
				<span aria-hidden="true" title="Out-of-date">
					<d2l-icon class="assessment-outdated-icon" icon="tier1:refresh" />
				</span>
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

	_getAriaText(data) {
		var text = '';
		if (data.hasOverallAssessment) {
			text += data.levelName + ", ";
		}
		else {
			text += this.localize('notEvaluated') + ", ";
		}

		if (data.isManualOverride) {
			text += this.localize('manualOverride') + ', ';
		}

		if (data.outdated) {
			text += this.localize('outOfDate') + ', ';
		}

		if (data.isPublished) {
			text += this.localize('published') + ', ';
		}
		else {
			text += this.localize('notPublished') + ', ';
		}

		text += this.localize('tooltipUserOutcomeAssessments', 'numAssessed', data.totalEvaluatedAssessments, 'numTotal', data.totalAssessments);
		text += '. ';
		text += this.localize('pressToOpenTheEvaluationPage');
		text += '.';
		console.log(text);
		return text;
	}

	_getTooltipText(totalActivities, totalAssessed) {
		return this.localize('tooltipUserOutcomeAssessments', 'numAssessed', totalAssessed, 'numTotal', totalActivities);
	}

	_onClick() {
		const link = this._cellData.evalPageHref;
		if (!link) {
			return;
		}
		window.location = link;
	}

	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}
		let name, color, hasOverallDemonstration, overallAssessmentDate, mostRecentAssessmentDate, hasManualOverride, isPublished, isOutOfDate, evalHref;
		let assessmentCount = 0;
		let assessmentWithDemonstrationCount = 0;
		entity.onActivityChanged(activity => {
			if (!activity) {
				return;
			}
			if (activity.getType() === 'checkpoint-item') {
				//Activity is an overall achievement
				evalHref = activity.getEvalPageHref();
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
				hasOverallAssessment: hasOverallDemonstration,
				totalAssessments: assessmentCount,
				totalEvaluatedAssessments: assessmentWithDemonstrationCount,
				levelName: name,
				levelColor: color + '1A',
				isManualOverride: hasManualOverride,
				outdated: isOutOfDate,
				published: isPublished,
				evalPageHref: evalHref
			};
		});
	}

	_onKeyDown(event) {
		if (event.keyCode === KEYCODES.ENTER || event.keyCode === KEYCODES.SPACE) {
			this._onClick();
		}
	}
}

customElements.define(MasteryViewUserOutcomeCell.is, MasteryViewUserOutcomeCell);
