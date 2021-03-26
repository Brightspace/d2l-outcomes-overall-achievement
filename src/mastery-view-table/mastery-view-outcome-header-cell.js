import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import { css, html } from 'lit-element';
import { StackedBar } from '../stacked-bar/stacked-bar';

export class MasteryViewOutcomeHeaderCell extends StackedBar {

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
			}
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
					padding-bottom: 0.45rem;
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
					margin-bottom: 0.3rem;
					width: 11rem;
				}

				#tooltip-level-dist-table {
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
			`
		];
	}

	constructor() {
		super();
		this.tooltipAlign = '';
	}

	static get is() { return 'd2l-mastery-view-outcome-header-cell'; }

	render() {
		const outcomeLabel = this.outcomeName && this.outcomeName.length ? html`${this.outcomeName}. ` : null;
		return html`
		<div id="cell-content-container" tabindex="0" role="button">
			<div class="outcome-name-description">
				<b>${outcomeLabel}</b>${this.outcomeDescription}
			</div>
			<div id="graph-container">
				${this._renderGraph()}
			</div>
			<d2l-tooltip
				id="tooltip"
				for="cell-content-container"
				position="bottom"
				align="${this.tooltipAlign}"
			>
				<div id="tooltip-outcome-info" aria-hidden="true">${outcomeLabel}${this.outcomeDescription}</div>
				<table id="tooltip-level-dist-table" aria-hidden="true">
					${this._histData.map(this._renderTooltipLine.bind(this))}
				</table>
				<div id="tooltip-aria-label" aria-label="${this._getGraphLevelsLabel()}"></div>
			</d2l-tooltip>

		</div>
		`;
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
		const displayCount = (this.displayUnassessed ? this._totalCount : this._assessedCount);
		const percentage = Math.floor(100.0 * levelData.count / (displayCount || 1));
		return this.localize('percentLabel', 'percentage', String(percentage));
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
