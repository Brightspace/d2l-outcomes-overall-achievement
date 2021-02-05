import { LitElement, html, css } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { TelemetryMixin } from '../TelemetryMixin';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import 'd2l-table/d2l-table.js';
import { MasteryViewRowEntity } from '../entities/MasteryViewRowEntity';
import '../custom-icons/visibility-hide.js';
import '../custom-icons/visibility-show.js';
import { Consts } from '../consts';
import { ErrorLogger } from '../ErrorLogger.js';

const KEYCODES = {
	ENTER: 13,
	SPACE: 32
};

export class MasteryViewUserOutcomeCell extends SkeletonMixin(LocalizeMixin(EntityMixinLit(TelemetryMixin(LitElement)))) {
	static get is() { return 'd2l-mastery-view-user-outcome-cell'; }

	static get properties() {
		return {
			outcomeHref: {
				attribute: 'outcome-href',
				type: String
			},
			_cellData: Object,
			_logger: ErrorLogger
		};
	}

	static get styles() {
		return [
			css`
				.cell-content-container:focus {
					outline-color: var(--d2l-color-celestine);
				}

				.cell-content-container {
					width: 9.9rem;
					height: 3rem;
				}
				
				.cell-content-container:not(.skeleton) {
					cursor: pointer;
				}

				#assessment-fraction-container {
					line-height: 0.6rem;
				}

				#assessment-fraction {
					display: inline-block;
					padding-left: 0.3rem;
					padding-top: 0.3rem;
					padding-right: 0.3rem;
					font-family: 'Lato', sans-serif;
					font-size: 0.6rem;
					color: var(--d2l-color-tungsten)
				}

				.assessment-label-container {
					display: inline-block;
					padding-left: 1.5rem;
					padding-bottom: 0.4rem;
				}

				:host([dir="rtl"]) .assessment-label-container {
					padding-right: 1.5rem;
					padding-left: 0;
				}

				.assessment-level-label {
					@apply --d2l-body-compact-text;
					float: left;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					max-width: 5rem;
					line-height: 1.2rem;
				}

				.assessment-label-skeleton {
					width: 4.8rem;
					height: 1rem;
					margin-left: 1.5rem;
					margin-top: 1rem;
					float: left;
				}

				.d2l-skeletize {
					position: relative;
					z-index: 0;
				}

				:host([dir="rtl"]) .assessment-label-skeleton {
					margin-left: 0rem;
					margin-right: 1.5rem;
					float: right;
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
					padding-right: 0.3rem;
					padding-top: 0.15rem;
				}

				:host([dir="rtl"]) .assessment-outdated-icon {
					float: left;
					padding-left: 0.3rem;
					padding-right: 0;
				}

				.assessment-publish-status-icon {
					display: inline-block;
					float: right;
					padding-right: 0.45rem;
					padding-top: 0.3rem;
				}

				:host([dir="rtl"]) .assessment-publish-status-icon {
					float: left;
					padding-left: 0.45rem;
					padding-right: 0;
				}
			`,
			super.styles
		];
	}

	constructor() {
		super();
		this.skeleton = true;
		this._setEntityType(MasteryViewRowEntity);
	}

	render() {
		if (this.skeleton) {
			return html`
				<div
					class="cell-content-container skeleton"
					tabindex="0"
					aria-label="${this._getAriaText(null)}"
				>
					<div class="assessment-label-skeleton d2l-skeletize" />
				</div>
			`;
		}

		const data = this._cellData;

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
				<span
					id="assessment-fraction"
					title=${this._getTooltipText(data.totalAssessments, data.totalEvaluatedAssessments)}
				>
					${data.totalEvaluatedAssessments}/${data.totalAssessments}
				</span>
			</div>
			<div class="assessment-label-container" aria-hidden="true">
				<div class="assessment-level-label" title="${data.levelName}">
					${data.levelName}
				</div>
				${data.isManualOverride ? html`
					<span class="override-indicator" title="${this.localize('manualOverride')}"><b>*</b></span>
				` : null}
			</div>
			<div
				class="assessment-publish-status-icon"
				aria-hidden="true"
				title="${data.published ? this.localize('published') : this.localize('notPublished')}"
			>
				${data.published ? html`<d2l-icon-visibility-show />` : html`<d2l-icon-visibility-hide />`}
			</div>
			${data.outdated ? html`
				<span aria-hidden="true" title="${this.localize('outOfDate')}">
					<d2l-icon class="assessment-outdated-icon" icon="tier1:refresh" />
				</span>
			` : null}

		</div>
		`;
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	_getAriaText(data) {
		if (!data) {
			return this.localize('loadingOverallAchievement');
		}

		var assessmentInfo = '';
		if (data.levelName === Consts.noCoaLevelName) {
			assessmentInfo += this.localize('notEvaluated') + this.localize('commaSeparator');
		}
		else {
			assessmentInfo += data.levelName + this.localize('commaSeparator');
		}

		if (data.isManualOverride) {
			assessmentInfo += this.localize('manualOverride') + this.localize('commaSeparator');
		}

		if (data.outdated) {
			assessmentInfo += this.localize('outOfDate') + this.localize('commaSeparator');
		}

		if (data.published) {
			assessmentInfo += this.localize('published') + this.localize('commaSeparator');
		}
		else {
			assessmentInfo += this.localize('notPublished') + this.localize('commaSeparator');
		}

		assessmentInfo += this.localize('tooltipUserOutcomeAssessments',
			'numAssessed', data.totalEvaluatedAssessments,
			'numTotal', data.totalAssessments);

		return this.localize('masteryViewUserOutcomeScreenReaderText',
			'assessmentInfo', assessmentInfo
		);
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

	_onEntityChanged(entity, error) {
		if (!entity) {
			this._logger.logSirenError(this.href, 'GET', error);
			return;
		}

		const cellEntity = entity.getCells().find(cell => cell.getOutcomeHref() === this.outcomeHref);
		if (!cellEntity) {
			return;
		}

		const activityCount = cellEntity.getActivityCount();
		const assessedActivityCount = cellEntity.getAssessedActivityCount();
		const evalHref = cellEntity.getEvaluationHref();
		const isOutOfDate = cellEntity.isOutdated();

		let name = Consts.noCoaLevelName;
		let color = Consts.noCoaLevelColor;
		let isPublished = false;
		let hasManualOverride = false;

		cellEntity.onCheckpointDemonstrationChanged(demonstration => {
			isPublished = demonstration.isPublished();

			const demonstratedLevel = demonstration.getDemonstratedLevel();
			if (demonstratedLevel) {
				demonstratedLevel.onLevelChanged(loa => {
					name = loa.getName();
					color = loa.getColor();
				}, error => {
					this._logger.logSirenError(demonstratedLevel._levelHref(), 'GET', error);
				});
			}
			demonstration.subEntitiesLoaded().then(() => {
				let suggestedLevelId = null;
				demonstration.getAllDemonstratableLevels().map(level => {
					if (level.isSuggested()) {
						suggestedLevelId = level.getLevelId();
					}
				});

				if (suggestedLevelId && demonstration.isMasteryOverride()) {
					hasManualOverride = true;
				}
			});
		}, error => {
			const demonstration = cellEntity._getCheckpointDemonstration() || {};
			const href = (demonstration && demonstration.getSelfHref) ? demonstration.getSelfHref() : null;
			this._logger.logSirenError(href, 'GET', error);
		});

		entity.subEntitiesLoaded().then(() => {
			this._cellData = {
				totalAssessments: activityCount,
				totalEvaluatedAssessments: assessedActivityCount,
				levelName: name,
				levelColor: color + Consts.tenPercentAlphaHex,
				isManualOverride: hasManualOverride,
				outdated: isOutOfDate,
				published: isPublished,
				evalPageHref: evalHref
			};
			this.skeleton = false;

			this.dispatchEvent(new CustomEvent(
				Consts.events.masteryViewCellLoaded,
				{ bubbles: true, composed: true }
			));
		});
	}

	_onKeyDown(event) {
		if (event.keyCode === KEYCODES.ENTER || event.keyCode === KEYCODES.SPACE) {
			this._onClick();
		}
	}
}

customElements.define(MasteryViewUserOutcomeCell.is, MasteryViewUserOutcomeCell);
