import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import '../custom-icons/visibility-hide.js';
import '../custom-icons/visibility-show.js';
import { css, html, LitElement } from 'lit-element';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles';
import { Consts } from '../consts';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { ErrorLogger } from '../ErrorLogger.js';
import { LocalizeMixin } from '../LocalizeMixin';
import { MasteryViewRowEntity } from '../entities/MasteryViewRowEntity';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { TelemetryMixin } from '../TelemetryMixin';

const KEYCODES = {
	ENTER: 13,
	SPACE: 32
};

export class MasteryViewUserOutcomeCell extends SkeletonMixin(LocalizeMixin(EntityMixinLit(TelemetryMixin(LitElement)))) {

	static get properties() {
		return {
			outcomeHref: {
				attribute: 'outcome-href',
				type: String
			},
			logger: ErrorLogger,
			_cellData: Object
		};
	}

	static get styles() {
		return [
			bodyCompactStyles,
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
					position: relative;
				}

				#assessment-fraction {
					position: absolute;
					font-family: 'Lato', sans-serif;
					font-size: 0.6rem;
					color: var(--d2l-color-tungsten);
					line-height: 1.25rem;
					padding-left: 0.3rem;
				}

				.assessment-label-container {
					display: flex;
					align-items:center;
				}

				:host([dir="rtl"]) #assessment-fraction {
					padding-right: 0.3rem;
					padding-left: 0;
				}

				.assessment-level-label {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					max-width: 5rem;
					display: block;
				}

				.assessment-label-skeleton {
					width: 4.8rem;
					height: 1rem;
					margin-left: 1.5rem;
					margin-right: 1.5rem;
				}

				.d2l-skeletize {
					position: relative;
					z-index: 0;
				}

				.skeleton {
					display: flex;
					align-items: center;
				}

				.cell-content-container:hover .assessment-level-label {
					text-decoration: underline;
				}

				.assessment-info-container {
					display: flex;
					align-items: center;
					height: 100%;
				}

				.assessment-info-container > div {
					padding-left: 1.5rem;
					padding-right: 0.45rem;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				:host([dir="rtl"]) .assessment-info-container > div {
					padding-left: 0.45rem;
					padding-right: 1.5rem;
				}

				.assessment-icon-container {
					display: flex;
					align-items: center;
				}

				.assessment-icon-container > div {
					padding-left: 0.3rem;
				}

				:host([dir="rtl"]) .assessment-icon-container > div {
					padding-right: 0.3rem;
					padding-left: 0;
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

	static get is() { return 'd2l-mastery-view-user-outcome-cell'; }

	render() {
		if (this.skeleton) {
			return html`
				<div
					class="cell-content-container skeleton"
					tabindex="0"
					aria-label="${this._getAriaText(null)}"
				>
					<div class="assessment-label-skeleton d2l-skeletize"></div>
				</div>
			`;
		}

		const data = this._cellData;

		return html`
		<div
			class="cell-content-container"
			tabindex="0"
			style="background-color:${data.levelColor}"
			@click=${this._onClick}
			@keydown=${this._onKeyDown}
			aria-label="${this._getAriaText(data)}"
		>
			${this._renderAssessmentFraction(data)}
			<div class="assessment-info-container" aria-hidden="true">
				<div aria-hidden="true">
					<div class="assessment-label-container" aria-hidden="true">
						<div class="assessment-level-label d2l-body-compact" title="${data.levelName}">
							${data.levelName}
						</div>
						${this._renderOverrideIndicator(data)}
					</div>
					<div class="assessment-icon-container">
						${this._renderAssessmentOutdatedIcon(data)}
						<div
							class="assessment-publish-status-icon"
							aria-hidden="true"
							title="${data.published ? this.localize('published') : this.localize('notPublished')}"
						>
							${data.published ? html`<d2l-icon-visibility-show></d2l-icon-visibility-show>` : html`<d2l-icon-visibility-hide></d2l-icon-visibility-hide>`}
						</div>
					</div>
				</div>
			</div>
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

		let assessmentInfo = '';
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
			this.logger.logSirenError(this.href, 'GET', error);
			return;
		}

		const cellEntity = entity.getCells().find(cell => cell.getOutcomeHref() === this.outcomeHref);
		if (!cellEntity) {
			this._cellData = {};
			this.skeleton = true;
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
					this.logger.logSirenError(demonstratedLevel._levelHref(), 'GET', error);
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
			this.logger.logSirenError(href, 'GET', error);
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

	_renderAssessmentFraction(data) {
		if (!data || !Number.isInteger(data.totalAssessments) || !Number.isInteger(data.totalEvaluatedAssessments)) {
			return;
		}

		return html`
			<div id="assessment-fraction-container" aria-hidden="true">
				<span
					id="assessment-fraction"
					title=${this._getTooltipText(data.totalAssessments, data.totalEvaluatedAssessments)}
				>
					${data.totalEvaluatedAssessments}/${data.totalAssessments}
				</span>
			</div>
		`;
	}

	_renderAssessmentOutdatedIcon(data) {
		if (!data || !data.outdated) {
			return;
		}

		return html`
			<div aria-hidden="true" title="${this.localize('outOfDate')}">
				<d2l-icon class="assessment-outdated-icon" icon="tier1:refresh"></d2l-icon>
			</div>
		`;
	}

	_renderOverrideIndicator(data) {
		if (!data || !data.isManualOverride) {
			return;
		}

		return html`
			<span class="override-indicator" title="${this.localize('manualOverride')}">
				<b>*</b>
			</span>
		`;
	}

}

customElements.define(MasteryViewUserOutcomeCell.is, MasteryViewUserOutcomeCell);
