import { html, css } from 'lit-element';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import { StackedBar } from '../stacked-bar/stacked-bar';

export class MasteryViewOutcomeHeaderCell extends StackedBar {
	static get is() { return 'd2l-mastery-view-outcome-header-cell'; }

	static get properties() {
		return {
			outcomeName: {
				type: String,
				attribute: 'outcome-name'
			},
			outcomeDescription: {
				type: String,
				attribute: 'outcome-description'
			}
		};
	}

	static get styles() {
		return [
			css`

				#cell-content-container:focus {
					outline-color: var(--d2l-color-celestine);
				}

				.outcome-name-description {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					padding-top: 12px;
					padding-left: 12px;
					padding-right: 9px;
				}

				:host([dir="rtl"]) .outcome-name-description {
					padding-left: 9px;
					padding-right: 12px;
				}

				#graph-container {
					align-items: stretch;
					display: flex;
					height: 12px;
					width: 174px;
					padding-top: 6px;
					padding-bottom: 9px;
					padding-left: 12px;
					padding-right: 9px;
				}

				:host([dir="rtl"]) #graph-container {
					padding-left: 9px;
					padding-right: 12px;
				}

				.graph-bar {
					margin-right: 2px;
				}

				:host(:not([dir="rtl"])) .graph-bar:first-child {
					border-top-left-radius: 6px;
					border-bottom-left-radius: 6px;
				}

				:host([dir="rtl"]) .graph-bar:first-child {
					border-top-right-radius: 6px;
					border-bottom-right-radius: 6px;
				}

				:host(:not([dir="rtl"])) .graph-bar:last-child {
					border-top-right-radius: 6px;
					border-bottom-right-radius: 6px;
					margin-right: 0px;
				}

				:host([dir="rtl"]) .graph-bar:last-child {
					border-top-left-radius: 6px;
					border-bottom-left-radius: 6px;
					margin-left: 0px;
				}

				.tooltip-outcome-info {
					margin-bottom: 6px;
					width: 220px;
				}

				.tooltip-line-container {
					justify-content: left;
					align-items: center;
					height: 14px;
				}

				:host([dir="rtl"]) .tooltip-line-container {
					justify-content: right;
				}

				.color-patch {
					margin-right: 7px;
				}				

				:host([dir="rtl"]) .color-patch {
					margin-left: 7px;
					margin-right: 0px;
				}				

				td {
					padding-bottom: 3px;
					vertical-align: top;
					color: white;
					font-size: 14px;
					line-height: 14px;
				}

				.tooltip-level-dist-table {
					max-width: 216px;
				}

				.tooltip-level-label {
					margin-right: 7px;
					text-align: left;
					word-wrap: break-word;
				}

				:host([dir="rtl"]) .tooltip-level-label {
					margin-left: 7px;
					margin-right: 0px;
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

	render() {
		return html`
		<div id="cell-content-container" tabindex="0" aria-labelledby="tooltip">
			<div class="outcome-name-description">
				<b>${this.outcomeName}.</b> ${this.outcomeDescription}
			</div>
			<div id="graph-container">
				${this._histData.map(this._renderBar.bind(this))}
			</div>
		</div>
		<d2l-tooltip
			id="tooltip"
			for="cell-content-container"
			position="bottom"
			boundary="{&quot;left&quot;:0, &quot;right&quot;:66}">
			<div class="tooltip-outcome-info">${this.outcomeName}. ${this.outcomeDescription}</div>
			<table class="tooltip-level-dist-table">
				${this._histData.map(this._renderTooltipLine.bind(this))}
			</table>
		</d2l-tooltip>
		`;
	}

	_getLevelCountText(levelData) {
		const displayCount = (this.displayUnassessed ? this._totalCount : this._assessedCount);
		const percentage = Math.floor(100.0 * levelData.count / (displayCount || 1));
		return `${percentage}%`;
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
			<td><div class="tooltip-level-label">${levelData.name}</div></td>
			<td><div class="tooltip-percent-label">${this._getLevelCountText(levelData)}</div></td>
		</tr>
		`;
	}
}

customElements.define(MasteryViewOutcomeHeaderCell.is, MasteryViewOutcomeHeaderCell);
