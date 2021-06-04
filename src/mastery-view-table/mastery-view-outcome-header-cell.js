import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import { css, html, LitElement } from 'lit-element';
import { Consts } from '../consts.js';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { OutcomeActivityCollectionEntity } from '../entities/OutcomeActivityCollectionEntity';
import { OutcomeLevelDistributionEntity } from '../entities/OutcomeLevelDistributionEntity';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

export class MasteryViewOutcomeHeaderCell extends SkeletonMixin(LocalizeMixin(EntityMixinLit(LitElement))) {

	static get properties() {
		return {
			outcomeName: {
				type: String,
				attribute: 'outcome-name'
			},
			outcomeDescription: {
				type: String,
				attribute: 'outcome-description'
			},
			tooltipAlign: {
				type: String,
				attribute: 'tooltip-align'
			},
			disableGraph: {
				type: Boolean,
				attribute: 'disable-graph'
			},
			useAlternateGraphCall: {
				type: Boolean,
				attribute: 'use-alternate-graph-call'
			},
			_histData: { attribute: false },
			_assessedCount: { attribute: false },
			_totalCount: { attribute: false }
		};
	}

	static get styles() {
		return [
			super.styles,
			css`
				#cell-content-container:focus {
					outline-color: var(--d2l-color-celestine);
				}

				#cell-content-container {
					width: 9.9rem;
					padding-bottom: 0.45rem;
				}

				.outcome-name-description {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					padding-top: 0.6rem;
					padding-left: 0.6rem;
					padding-right: 0.45rem;
					min-height: 2rem;
				}

				:host([dir="rtl"]) .outcome-name-description {
					padding-left: 0.45rem;
					padding-right: 0.6rem;
				}

				#graph-container {
					align-items: stretch;
					display: flex;
					height: 0.6rem;
					width: 8.7rem;
					padding-top: 0.3rem;
					padding-left: 0.6rem;
					padding-right: 0.45rem;
				}

				:host([dir="rtl"]) #graph-container {
					padding-left: 0.45rem;
					padding-right: 0.6rem;
				}

				.graph-bar {
					margin-right: 0.1rem;
				}

				:host([dir="rtl"]) .graph-bar {
					margin-right: 0;
					margin-left: 0.1rem;
				}

				:host(:not([dir="rtl"])) .graph-bar:first-child {
					border-top-left-radius: 0.3rem;
					border-bottom-left-radius: 0.3rem;
				}

				:host([dir="rtl"]) .graph-bar:first-child {
					border-top-right-radius: 0.3rem;
					border-bottom-right-radius: 0.3rem;
				}

				:host(:not([dir="rtl"])) .graph-bar:last-child {
					border-top-right-radius: 0.3rem;
					border-bottom-right-radius: 0.3rem;
					margin-right: 0;
				}

				:host([dir="rtl"]) .graph-bar:last-child {
					border-top-left-radius: 0.3rem;
					border-bottom-left-radius: 0.3rem;
					margin-left: 0;
				}

				#tooltip-outcome-info {
					width: 11rem;
				}

				#tooltip-level-dist-table {
					margin-top: 0.3rem;
					max-width: 11rem;
				}

				.tooltip-line-container {
					justify-content: left;
					align-items: center;
					height: 0.7rem;
				}

				:host([dir="rtl"]) .tooltip-line-container {
					justify-content: right;
				}

				.color-patch {
					margin-right: 0.35rem;
				}

				:host([dir="rtl"]) .color-patch {
					margin-left: 0.35rem;
					margin-right: 0;
				}

				td {
					padding-bottom: 0.15rem;
					vertical-align: top;
					color: white;
					font-size: 0.7rem;
					line-height: 0.7rem;
				}

				.tooltip-level-dist-table {
					max-width: 10.8rem;
				}

				.tooltip-level-label {
					margin-right: 0.35rem;
					text-align: left;
					word-wrap: break-word;
				}

				:host([dir="rtl"]) .tooltip-level-label {
					margin-left: 0.35rem;
					margin-right: 0;
					text-align: right;
				}

				.tooltip-percent-label {
					text-align: left;
				}

				:host([dir="rtl"]) .tooltip-percent-label {
					text-align: right;
				}

				.graph-bar-skeleton {
					border-radius: 4px 4px 4px 4px;
					flex-grow: 1;
				}

				.empty-bar {
					background: var(--d2l-color-mica);
					flex-grow: 1;
				}

				@media (pointer: fine) {
					:host(:not([skeleton])) #cell-content-container:focus .graph-bar,
					:host(:not([skeleton])) #cell-content-container:hover .graph-bar {
						filter: brightness(120%);
						outline: none;
					}

					#cell-content-container:focus .graph-bar,
					#cell-content-container:hover .graph-bar {
						animation: raise 200ms ease-in;
						box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
					}
				}

				@keyframes raise {
					0% {
						box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0);
						top: 0;
					}

					100% {
						box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
						top: -2px;
					}
				}

				[hidden] {
					display: none !important;
				}
			`
		];
	}

	constructor() {
		super();
		this.tooltipAlign = '';
		this.disableGraph = this.disableGraph || false;
		this.useAlternateGraphCall = this.useAlternateGraphCall || false;
		this._histData = [];
		this._totalCount = 0;
		this._assessedCount = 0;
		this.skeleton = true;
	}

	static get is() { return 'd2l-mastery-view-outcome-header-cell'; }

	connectedCallback() {
		super.connectedCallback();

		if (this.disableGraph) {
			return;
		}

		if (!this.useAlternateGraphCall) {
			this._setEntityType(OutcomeActivityCollectionEntity);
		} else {
			this._setEntityType(OutcomeLevelDistributionEntity);
		}
	}

	render() {
		const outcomeLabel = this.outcomeName && this.outcomeName.length ? html`${this.outcomeName}. ` : null;
		return html`
		<div id="cell-content-container" tabindex="0" role="button">
			<div class="outcome-name-description">
				<b>${outcomeLabel}</b>${this.outcomeDescription}
			</div>
			${this._renderGraphContainer()}
			<d2l-tooltip
				id="tooltip"
				for="cell-content-container"
				position="bottom"
				align="${this.tooltipAlign}"
			>
				<div id="tooltip-outcome-info" aria-hidden="true">${outcomeLabel}${this.outcomeDescription}</div>
				${this._renderGraphToolTipSection()}
			</d2l-tooltip>

		</div>
		`;
	}

	shouldUpdate(changedProperties) {
		if (this.disableGraph) {
			return true;
		}

		return super.shouldUpdate(changedProperties);
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	_buildHistDataCounts(levels, counts) {
		levels.sort((left, right) => {
			return left.getSortOrder() - right.getSortOrder();
		});

		counts = new Map(counts.map(
			key => [key.getLevelId(), key.getCount()])
		);

		for (const level of levels) {
			const levelId = level.getLevelId();
			const count = counts.get(levelId) || 0;

			this._histData.push({
				name: level.getName(),
				color: level.getColor(),
				count
			});
			this._totalCount += count;
		}

		const count = counts.get(null) || 0;

		this._histData.push({
			name: this.localize('notEvaluated'),
			color: Consts.unassessedColor,
			count
		});
		this._totalCount += count;
	}

	_buildHistDataDemonstrations(levels, demonstrations) {
		levels.sort((left, right) => {
			return left.getSortOrder() - right.getSortOrder();
		});

		const levelMap = levels.reduce((acc, level) => {
			acc[level.getLevelId()] = {
				color: level.getColor(),
				count: 0,
				name: level.getName()
			};
			return acc;
		}, {});
		for (const href in demonstrations) {
			const demonstratedLevel = demonstrations[href];
			if (levelMap[demonstratedLevel]) {
				levelMap[demonstratedLevel].count++;
			}
		}

		this._histData = Object.values(levelMap);
		const unassessedData = {
			color: Consts.unassessedColor,
			count: this._totalCount - this._assessedCount,
			name: this.localize('notEvaluated')
		};
		this._histData.push(unassessedData);
	}

	_getGraphLevelsLabel() {
		let labelText = '';
		this._histData.map((levelData) => {
			const name = levelData.name;
			const percentage = this._getLevelCountText(levelData);
			labelText += `${this.localize('levelNamePercentLabel', 'name', name, 'percentage', percentage)} `;
		});

		return labelText;
	}

	_getLevelCountText(levelData) {
		const totalCount = this._totalCount || 1;
		const percentage = Math.floor(100.0 * levelData.count / totalCount);

		return this.localize('percentLabel', 'percentage', percentage);
	}

	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}

		if (this._entityType === OutcomeActivityCollectionEntity) {
			const demonstrations = {};

			entity.onActivityChanged(activity => {
				activity.onAssessedDemonstrationChanged(demonstration => {
					const demonstrationHref = demonstration.getSelfHref();
					const demonstratedLevel = demonstration.getDemonstratedLevel();
					const levelId = demonstratedLevel.getLevelId();
					if (levelId && demonstrationHref) {
						demonstrations[demonstrationHref] = levelId;
					}
				});
			});

			const levels = [];

			entity.onDefaultScaleChanged(scale => {
				scale.onLevelChanged(level => levels.push(level));
			});
			entity.subEntitiesLoaded().then(() => {
				this._assessedCount = Object.keys(demonstrations).length;
				this._totalCount = entity.getOutcomeActivities().length;

				this._buildHistDataDemonstrations(levels, demonstrations);

				this.skeleton = false;
			});
		} else if (this._entityType === OutcomeLevelDistributionEntity) {
			const levels = [];

			entity.onDefaultScaleChanged(scale => {
				scale.onLevelChanged(level => levels.push(level));
			});

			const counts = entity.getCounts();

			entity.subEntitiesLoaded().then(() => {
				this._buildHistDataCounts(levels, counts);

				this.skeleton = false;
			});
		}
	}

	_renderBar(levelData) {
		if (!levelData || !levelData.count) {
			return null;
		}

		return html`
			<div
				class="graph-bar"
				style="background: ${levelData.color}; flex-grow: ${levelData.count}"
			></div>
		`;
	}

	_renderGraph() {
		if (this.skeleton) {
			return html`<div class="graph-bar-skeleton d2l-skeletize"></div>`;
		}

		if (this._totalCount === 0) {
			return html`<div class="graph-bar empty-bar"></div>`;
		}

		return this._histData.map(this._renderBar.bind(this));
	}

	_renderGraphContainer() {
		if (this.disableGraph) {
			return;
		}

		return html`
			<div id="graph-container">
				${this._renderGraph()}
			</div>
		`;
	}

	_renderGraphToolTipSection() {
		if (this.disableGraph) {
			return;
		}

		return html`
			<table id="tooltip-level-dist-table" aria-hidden="true">
				${this._histData.map(this._renderTooltipLine.bind(this))}
			</table>
			<div id="tooltip-aria-label" aria-label="${this._getGraphLevelsLabel()}"></div>
		`;
	}

	_renderTooltipLine(levelData) {
		return html`
		<tr class="tooltip-line-container">
			<td>
				<svg class="color-patch" width="18" height="12" aria-hidden>
					<rect
						x="1"
						y="1"
						rx="5"
						ry="5"
						width="16"
						height="10"
						fill="${levelData.color}"
						stroke="#FFFFFF"
						stroke-width="2"
					/>
				</svg>
			</td>
			<td>
				<div class="tooltip-level-label">${levelData.name}</div>
			</td>
			<td>
				<div class="tooltip-percent-label">${this._getLevelCountText(levelData)}</div>
			</td>
		</tr>
		`;
	}

}

customElements.define(MasteryViewOutcomeHeaderCell.is, MasteryViewOutcomeHeaderCell);
