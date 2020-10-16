import { LitElement, html, css } from 'lit-element';
import { LocalizeMixin } from '../LocalizeMixin';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';
import { TrendMixin } from './TrendMixin';
import '@brightspace-ui/core/components/colors/colors';
import '@brightspace-ui/core/components/icons/icon';
import '@brightspace-ui/core/components/tooltip/tooltip';
import { formatDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { ResizeObserver } from 'd2l-resize-aware/resize-observer-module';

const COMPONENT_HEIGHT = 120;
const DIAMOND_SIZE = 18;
const DIAMOND_WIDTH = Math.sqrt(DIAMOND_SIZE * DIAMOND_SIZE / 2) * 2;
const FOOTER_HEIGHT = 22;
const GRID_THICKNESS = 1;
const NOT_ASSESSED_HEIGHT = 4;
const TOOLTIP_GAP = 8;
const TOOLTIP_POINTER_SIZE = 8;
const SCROLL_VIEWPORT_FRACTION = 0.5;

const BarTypes = Object.freeze({
	Bar: 'bar',
	Diamond: 'diamond'
});

class BigTrend extends TrendMixin(LocalizeMixin(RtlMixin(LitElement))) {

	static get is() { return 'd2l-coa-big-trend'; }

	static get properties() {
		return {
			instructor: { type: Boolean },
			outcomeTerm: { attribute: 'outcome-term', type: String }
		};
	}

	static get styles() {
		return [
			css`
				:host {
					--block-focus-height-increase: 4px;
					--block-focus-width-increase: 110%;
					--block-max-width: 54px;
					--block-min-width: 24px;
					--block-spacing: 9px;
					--border-radius: 6px;
					--container-height: ${COMPONENT_HEIGHT}px;
					--footer-height: ${FOOTER_HEIGHT}px;
					--grid-color: #d3d9e3;
					--grid-label-color: #7C8695;
					--grid-thickness: ${GRID_THICKNESS}px;
					--label-font-size: 14px;
					--label-margin-top: 0;
					--max-tooltip-width: 210px;
					--not-assessed-color: #d3d9e3;
					--not-assessed-height: ${NOT_ASSESSED_HEIGHT}px;
					--scroll-button-width: 50px;
				}

				#container {
					position: relative;
				}

				.trend-pin .diamond {
					display: inline-block;
					flex-shrink: 0;
					position: relative;
					transform: rotate(45deg);
				}

				.diamond-post {
					display: inline-block;
					flex-shrink: 0;
					position: relative;
					width: 2px;
				}
	
				#grid {
					float: left;
					padding-top: var(--block-focus-height-increase);
					position: relative;
					width: 100%;
				}
	
				.h-line {
					background-color: var(--grid-color);
					height: var(--grid-thickness);
				}

				#scroll-container {
					height: calc(var(--container-height) + var(--block-focus-height-increase) + var(--footer-height));
					left: 0px;
					overflow-y: hidden;
					position: absolute;
					top: 0px;
					width: 100%;
				}

				#scroll {
					height: calc(var(--container-height) + var(--block-focus-height-increase) + var(--footer-height));
					overflow-x: scroll;
					overflow-y: hidden;
					padding: 0px var(--block-spacing);
					padding-bottom: 20px;
					scroll-behavior: smooth;
					width: calc(100% - 2 * var(--block-spacing));
				}

				.scroll-button {
					align-items: center;
					background: rgba(255, 255, 255, 0.5);
					display: flex;
					height: calc(var(--container-height) + var(--grid-thickness) + var(--footer-height));
					position: absolute;
					top: var(--block-focus-height-increase);
					vertical-align: middle;
					width: var(--scroll-button-width);
				}

				.scroll-button:hover {
					cursor: pointer;
					filter: brightness(120%);
				}

				#scroll-button-left {
					justify-content: flex-start;
				}

				:host(:not([dir="rtl"])) #scroll-button-left,
				:host([dir="rtl"]) #scroll-button-right {
					background: linear-gradient(90deg, white, transparent);
					left: 0px;
				}

				#scroll-button-right {
					justify-content: flex-end;
				}
				
				:host(:not([dir="rtl"])) #scroll-button-right,
				:host([dir="rtl"]) #scroll-button-left {
					background: linear-gradient(-90deg, white, transparent);
					right: 0px;
				}
	
				#data {
					align-items: flex-end;
					display: flex;
					flex-direction: row;
					height: calc(var(--container-height) + var(--block-focus-height-increase));
				}

				.grid-column {
					display: flex;
					flex-direction: column;
					height: var(--container-height);
					justify-content: flex-end;
					padding: 0px var(--block-spacing);
					padding-bottom: calc(var(--footer-height) + var(--block-spacing));
					position: relative;
					top: calc(var(--footer-height) + var(--block-spacing));
					width: 100%;
				}

				.grid-column.bar {
					max-width: var(--block-max-width);
					min-width: var(--block-min-width);
				}

				.grid-column.diamond {
					max-width: ${DIAMOND_WIDTH}px;
					min-width: ${DIAMOND_WIDTH}px;
				}

				.grid-column.section:not(:first-of-type) {
					border-inline-start: var(--grid-thickness) solid var(--grid-color);
				}
	
				.trend-group {
					align-items: center;
					display: flex;
					flex-direction: column;
					overflow: visible;
				}

				.grid-label { /* Must be different element type than .trend-block because of last-of-type selector */
					box-sizing: border-box;
					color: var(--grid-label-color);
					display: inline-block;
					font-size: var(--label-font-size);
					height: 0px;
					left: calc(var(--grid-thickness) * -1);
					position: relative;
					width: 100%;
				}

				.trend-block,
				.trend-pin {
					align-items: center;
					display: flex;
					flex-direction: column;
					flex-shrink: 0;
					margin-bottom: var(--grid-thickness);
					transition: all 0.3s ease-out;
					width: 100%;
				}

				.not-assessed .trend-block {
					background-color: var(--not-assessed-color);
					height: var(--not-assessed-height);
				}
	
				.trend-group .trend-block:first-of-type { /* Requires trend-blocks and not-assessed trend-blocks to be different element types */
					border-top-left-radius: var(--border-radius);
					border-top-right-radius: var(--border-radius);
				}
	
				.trend-group .trend-block:last-of-type {
					margin-bottom: 0px;
				}

				.trend-group:hover,
				.trend-group:focus {
					cursor: pointer;
					outline: none;
				}
				
				.trend-group:not(.not-assessed):hover .trend-block,
				.trend-group:not(.not-assessed):focus .trend-block,
				.trend-group:not(.not-assessed):hover .trend-pin > *,
				.trend-group:not(.not-assessed):focus .trend-pin > * {
					filter: brightness(120%);
					box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
				}
	
				.screen-reader {
					height: 1px;
					left: -99999px;
					overflow: hidden;
					position: absolute;
					width: 1px;
				}

				d2l-tooltip {
					max-width: var(--max-tooltip-width);
					text-align: center;
				}

				.clear {
					clear: both;
				}

				.hidden {
					display: none !important;
				}

				table {
					border-collapse: collapse;
					border: 1px solid black;
				}

				table td,
				table th {
					border: 1px solid black;
				}

				.no-scale {
					border: 1px solid var(--d2l-color-gypsum);
					border-radius: 8px;
					background-color: var(--d2l-color-regolith);
					color: var(--d2l-color-ferrite);
					padding: 15px;
					box-sizing: border-box;
					width: 100%;
				}
			`
		];
	}

	constructor() {
		super();
		this.instructor = false;
	}

	firstUpdated() {
		this.scrollContainer = this.renderRoot.getElementById('scroll');
		this.scrollButtonLeft = this.renderRoot.getElementById('scroll-button-left');
		this.scrollButtonRight = this.renderRoot.getElementById('scroll-button-right');

		this.resizeObserver = new ResizeObserver(() => {
			this._onDataScrolled();
			this._scrollToEnd();
		});

		this.resizeObserver.observe(this.scrollContainer);
	}

	render() {
		if (this._hasNoScale(this._trendData)) {
			const langTerm = this.instructor ? 'noScaleInstructor' : 'noScaleStudent';
			return html`<div class="no-scale">${this.localize(langTerm, 'outcome', this.outcomeTerm)}</div>`;
		}

		const rowHeight = this._getRowHeight(this._trendData);
		const gridHorizontal = this._getGridHorizontal(this._trendData, rowHeight);
		const trendItems = this._getTrendItems(this._trendData, rowHeight);

		// Reset scroll after each re-render
		setTimeout(() => {
			this._onDataScrolled();
			this._scrollToEnd();
		}, 0);

		return html`
			<div id="container" aria-hidden="true">
				<div id="grid">
					${gridHorizontal.map(item => html`<div class="h-line" style="margin-bottom: ${item.size}px;"></div>`)}
				</div>
				<div id="scroll-container">
					<div id="scroll" @scroll=${this._onDataScrolled}>
						<div id="data">
							${trendItems.map(this._renderTrendItem, this)}
						</div>
					</div>
				</div>
				<div id="scroll-button-left" class="scroll-button hidden" @click=${this._onScrollButtonClicked}>
					<d2l-icon icon="d2l-tier1:chevron-left"></d2l-icon>
				</div>
				<div id="scroll-button-right" class="scroll-button hidden" @click=${this._onScrollButtonClicked}>
					<d2l-icon icon="d2l-tier1:chevron-right"></d2l-icon>
				</div>
				<div class="clear"></div>
				${trendItems.map((item, i) => this._renderTrendItemTooltip(item, i, rowHeight))}
			</div>
			<div class="screen-reader">
				${this._renderScreenReaderText(trendItems)}
			</div>
		`;
	}

	_checkTrendData(trendData) {
		if (!trendData || !trendData.groups) {
			return false;
		}

		const trendGroups = trendData.groups;
		return trendGroups.length > 0 && trendGroups[0].attempts.length > 0;
	}

	_getAttemptGroupLabel(attempts) {
		return this._getAttemptGroupNames(attempts).join(', ');
	}

	_getAttemptGroupNames(attempts) {
		return attempts.map(attempt => attempt.name || this.localize('indexedAttempt', { num: attempt.attemptIndex }));
	}

	_getAttemptGroupScreenReaderText(attempts) {
		attempts = this._getAttemptGroupNames(attempts);

		const attemptNames = attempts.length > 1 ? attempts.slice(0, -1).join(', ') : attempts[0];
		const lastAttemptName = attempts.slice(-1);

		return this.localize(
			'bigTrendAttemptsScreenReaderString',
			'numAttempts', attempts.length,
			'attemptNames', attemptNames,
			'lastAttemptName', lastAttemptName
		);
	}

	_getColumnClasses(group) {
		const classes = [
			'grid-column',
			group.type
		];

		if (group.label) {
			classes.push('section');
		}

		return classes.join(' ');
	}

	_getGridHorizontal(trendData, rowHeight) {
		if (!trendData || !trendData.levels) {
			return [];
		}

		const levels = trendData.levels;
		const maxLevel = this._getMaxLevelScore(levels);
		const gridHeight = rowHeight - GRID_THICKNESS;

		const gridData = Array.apply(null, { length: maxLevel + 1 }).map((v, i) => {
			return {
				size: (i === maxLevel
					? FOOTER_HEIGHT
					: gridHeight
				)
			};
		});
		return gridData;
	}

	_getGroupClasses(group) {
		const classes = [
			'trend-group'
		];

		if (!this._groupHasBlocks(group)) {
			classes.push('not-assessed');
		}

		return classes.join(' ');
	}

	_getGroupLabel(group) {
		return formatDate(group.date, { format: 'MMM' });
	}

	_getMaxLevelScore(levels) {
		return Math.max.apply(null, Object.keys(levels).map(levelId => levels[levelId].score));
	}

	_getRowHeight(trendData) {
		if (!trendData || !trendData.levels) {
			return null;
		}

		const maxLevel = this._getMaxLevelScore(trendData.levels);
		return COMPONENT_HEIGHT / maxLevel;
	}

	_getScreenReaderTableHeadings() {
		return [
			this.localize('headingDate'),
			this.localize('headingEvidence'),
			this.localize('headingLoa')
		];
	}

	_getTooltipOffset(group, rowHeight) {
		let offset = TOOLTIP_POINTER_SIZE + TOOLTIP_GAP;

		if (!this._groupHasBlocks(group)) {
			offset -= rowHeight - GRID_THICKNESS - NOT_ASSESSED_HEIGHT;
		} else if (group.type === BarTypes.Diamond) {
			const maxHeight = Math.max(group.blocks.map(block => block.height));
			const diamondOverflow = Math.max(0, DIAMOND_WIDTH - GRID_THICKNESS - maxHeight);

			offset += diamondOverflow;
		}

		return offset;
	}

	_getTrendItems(trendData, rowHeight) {
		if (!trendData || !trendData.levels || !trendData.groups) {
			return [];
		}

		const levels = trendData.levels;
		const trendGroups = trendData.groups;
		const trendItems = [];
		const maxLevel = this._getMaxLevelScore(levels);
		const gridHeight = rowHeight - GRID_THICKNESS;
		let lastGroupId = null;

		trendGroups.forEach(group => {
			const blocks = [];

			const groupAttempts = group.attempts;
			const groupDate = formatDate(group.date, { format: 'MMMM d, yyyy' });
			const groupId = formatDate(group.date, { format: 'yyyy-MM' });
			const groupLabel = this._getGroupLabel(group);
			let groupName = (!group.name || group.name.trim() === '') ? this.localize('untitled') : group.name;
			const groupType = group.type;

			let type;
			switch (groupType.toLowerCase()) {
				case 'checkpoint-item':
					type = BarTypes.Diamond;
					groupName = this.localize('labelOverallAchievement');
					break;
				default:
					type = BarTypes.Bar;
					break;
			}

			if (type === BarTypes.Diamond && groupAttempts.length === 0) {
				return;
			}

			const groupItem = {
				date: groupDate,
				gridHeight: gridHeight,
				name: groupName,
				type
			};

			// Create vertical grid lines
			if (groupId !== lastGroupId) {
				groupItem.label = groupLabel;
			}

			lastGroupId = groupId;

			// Compute levels achieved
			const groupLevels = groupAttempts
				.filter((val, index, self) => self.indexOf(val) === index)
				.sort((left, right) => levels[left.levelId].score - levels[right.levelId].score);

			// Add trend blocks to group
			let prevScore = 0;
			for (const attempt of groupLevels) {
				const levelId = attempt.levelId;
				const color = levels[levelId].color;
				const height = COMPONENT_HEIGHT / maxLevel * (levels[levelId].score - prevScore) - GRID_THICKNESS;
				prevScore = levels[levelId].score;

				if (height <= 0) {
					continue;
				}

				blocks.push({
					color,
					height
				});
			}

			groupItem.blocks = blocks.reverse();
			// Group attempt labels
			const attemptLabels = [];
			let attemptCounter = 1;
			groupAttempts.forEach(attempt => {
				const levelId = attempt.levelId;
				let label = {
					id: levelId,
					name: levels[levelId].name,
					attempts: [ {
						attemptIndex: attemptCounter,
						name: attempt.name
					} ]
				};
				const prevAttempt = attemptLabels.pop();

				if (prevAttempt && prevAttempt.id === levelId) {
					label = prevAttempt;
					label.attempts.push({
						attemptIndex: attemptCounter,
						name: attempt.name
					});
				} else if (prevAttempt) {
					attemptLabels.push(prevAttempt);
				}

				attemptLabels.push(label);
				attemptCounter++;
			});

			groupItem.attempts = attemptLabels;

			trendItems.push(groupItem);
		}, this);

		return trendItems;
	}

	_getUniqueGroupId(groupIndex) {
		return `group${groupIndex}`;
	}

	_groupHasBlocks(group) {
		return group.blocks.length > 0;
	}

	_hasMultipleAttempts(group) {
		return group.attempts.length > 0 && (group.attempts.length > 1 || group.attempts[0].attempts.length > 1);
	}

	_hasNoScale(trendData) {
		return trendData && trendData.levels && Object.keys(trendData.levels).length === 0;
	}

	_isRtl() {
		return this._dir === 'rtl';
	}

	_onDataScrolled() {
		const scroll = this.scrollContainer.scrollLeft;
		const scrollMax = this.scrollContainer.scrollLeftMax
			|| (this.scrollContainer.scrollWidth - this.scrollContainer.offsetWidth);

		const leftHidden = this.scrollButtonLeft.classList.contains('hidden');
		const rightHidden = this.scrollButtonRight.classList.contains('hidden');

		if (scroll === 0 && !leftHidden) {
			this.scrollButtonLeft.classList.add('hidden');
		} else if (scroll !== 0 && leftHidden) {
			this.scrollButtonLeft.classList.remove('hidden');
		}

		if (Math.abs(scroll) === scrollMax && !rightHidden) {
			this.scrollButtonRight.classList.add('hidden');
		} else if (Math.abs(scroll) !== scrollMax && rightHidden) {
			this.scrollButtonRight.classList.remove('hidden');
		}
	}

	_onScrollButtonClicked(e) {
		const scrollButton = e.currentTarget;
		let scrollAmount = SCROLL_VIEWPORT_FRACTION * this.scrollContainer.offsetWidth;

		if (scrollButton === this.scrollButtonLeft) {
			scrollAmount *= -1;
		}

		if (this._isRtl()) {
			scrollAmount *= -1;
		}

		this.scrollContainer.scrollLeft += scrollAmount;
	}

	_renderScreenReaderText(trendItems) {
		const hasData = this._checkTrendData(this._trendData);

		if (!hasData) {
			return this.localize('notAssessed');
		}

		const headings = this._getScreenReaderTableHeadings();

		const renderedItems = trendItems.map(trendItem => {
			const attempts = trendItem.attempts.map(attemptGroup => {
				return html`
					<div>
						${this._hasMultipleAttempts(trendItem) ? this._getAttemptGroupScreenReaderText(attemptGroup.attempts) : null}
						${attemptGroup.name}
					</div>
				`;
			});

			return html`
				<tr>
					<td>${trendItem.date}</td>
					<td>${trendItem.name}</td>
					<td>
						${trendItem.blocks.length > 0 ? attempts : html`<div>${this.localize('notAssessed')}</div>`}
					</td>
				</tr>
			`;
		});

		return html`
			<table>
				<thead>
					<tr>
						${headings.map(h => html`<th>${h}</th>`)}
					</tr>
				</thead>
				<tbody>
					${renderedItems}
				</tbody>
			</table>
		`;
	}

	_renderTrendBar(trendItem, index) {
		const blocks = trendItem.blocks.length > 0
			? trendItem.blocks.map(block => html`<div class="trend-block" style="height: ${block.height}px; background-color: ${block.color};"></div>`)
			: html`<span class="trend-block" style="margin-top: calc(${trendItem.gridHeight}px - var(--not-assessed-height));"></span>`;

		const label = trendItem.label
			? html`<span class="grid-label">${trendItem.label}</span>`
			: null;

		return html`
			<div class=${this._getColumnClasses(trendItem)}>
				<div id=${this._getUniqueGroupId(index)} class=${this._getGroupClasses(trendItem)} tabindex="0">
					${blocks}
				</div>
				${label}
			</div>
		`;
	}

	_renderTrendItem(trendItem, index) {
		switch (trendItem.type) {
			case BarTypes.Diamond:
				return this._renderTrendPin(trendItem, index);
			default:
				return this._renderTrendBar(trendItem, index);
		}
	}

	_renderTrendItemTooltip(trendItem, index, rowHeight) {
		const attempts = trendItem.attempts.map(attemptGroup => {
			return html`
				<div>
					${this._hasMultipleAttempts(trendItem) ? html`<b>${this._getAttemptGroupLabel(attemptGroup.attempts)}</b>:` : null} 
					${attemptGroup.name}
				</div>
			`;
		});

		return html`
			<d2l-tooltip for=${this._getUniqueGroupId(index)} position="top" offset=${this._getTooltipOffset(trendItem, rowHeight)}>
				<div><b>${trendItem.name}</b></div>
				${trendItem.blocks.length > 0 ? attempts : html`<div>${this.localize('notAssessed')}</div>`}
			</d2l-tooltip>
		`;
	}

	_renderTrendPin(trendItem, index) {
		let blocks;
		if (trendItem.blocks.length > 0) {
			const extraPoleHeight = 2;
			const sizeDiff = DIAMOND_WIDTH - DIAMOND_SIZE;
			const pinOffset = sizeDiff / 2;

			blocks = trendItem.blocks.map(block => {
				const diamondOverflow = Math.max(0, DIAMOND_WIDTH - GRID_THICKNESS - block.height);

				const diamondStyles = [
					`background-color:${block.color}`,
					`height:${DIAMOND_SIZE}px`,
					`top:${pinOffset - diamondOverflow}px`,
					`width:${DIAMOND_SIZE}px`,
				].join(';');

				const postStyles = [
					`height:${block.height + extraPoleHeight - DIAMOND_WIDTH + diamondOverflow}px`,
					`background-color:${block.color}`,
					`top:${GRID_THICKNESS + sizeDiff - extraPoleHeight - diamondOverflow}px`
				].join(';');

				return html`
					<div class="trend-pin" style="height: ${block.height}px; min-width: ${DIAMOND_WIDTH}px">
						<div
							class="diamond"
							style=${diamondStyles}
						></div>
						<div
							class="diamond-post"
							style=${postStyles}
						></div>
					</div>
				`;
			});
		} else {
			return null;
		}

		const label = trendItem.label
			? html`<span class="grid-label">${trendItem.label}</span>`
			: null;

		return html`
			<div class=${this._getColumnClasses(trendItem)}>
				<div id=${this._getUniqueGroupId(index)} class=${this._getGroupClasses(trendItem)} tabindex="0">
					${blocks}
				</div>
				${label}
			</div>
		`;
	}

	_scrollToEnd() {
		const scrollMax = this.scrollContainer.scrollLeftMax
			|| (this.scrollContainer.scrollWidth - this.scrollContainer.offsetWidth);

		this.scrollContainer.scrollLeft = scrollMax * (this._isRtl() ? -1 : 1);
	}
}

customElements.define(BigTrend.is, BigTrend);
