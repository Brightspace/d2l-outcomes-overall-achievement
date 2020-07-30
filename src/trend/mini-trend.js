import { LitElement, html, css } from 'lit-element';
import { LocalizeMixin } from '../LocalizeMixin';
import { TrendMixin } from './TrendMixin';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';

const BLOCK_SPACING = 2;
const COMPONENT_HEIGHT = 36;
const MAX_TREND_ITEMS = 6;
const TOOLTIP_GAP = 8;
const TOOLTIP_POINTER_SIZE = 8;

class MiniTrend extends TrendMixin(LocalizeMixin(LitElement)) {
	static get is() { return 'd2l-coa-mini-trend'; }

	static get styles() {
		return [
			css`
				:host {
					--block-spacing: ${BLOCK_SPACING}px;
					--border-radius: 2px;
					--container-height: ${COMPONENT_HEIGHT}px;
					--max-tooltip-width: 210px;
					--trend-group-width: 12px;

					align-items: center;
					display: inline-flex;
					flex-direction: row;
					height: var(--container-height);
				}

				.trend-group {
					display: flex;
					flex-direction: column;
					height: var(--container-height);
					justify-content: flex-end;
					margin-inline-end: var(--block-spacing);
					width: var(--trend-group-width);
				}

				.trend-group:last-of-type {
					margin-inline-end: 0px;
				}

				.trend-block {
					margin-top: var(--block-spacing);
				}

				.trend-group .trend-block:first-of-type {
					border-top-left-radius: var(--border-radius);
					border-top-right-radius: var(--border-radius);
					margin-top: 0px;
				}

				.trend-group .trend-block:last-of-type {
					border-bottom-left-radius: var(--border-radius);
					border-bottom-right-radius: var(--border-radius);
				}

				.empty-text {
					@apply --d2l-body-small-text;
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
			`
		];
	}

	render() {
		const trendDataTruncated = this._truncTrendData(this._trendData);
		const trendItems = this._getTrendItems(trendDataTruncated);

		if (this._isNotAssessed(trendDataTruncated)) {
			return html`<div class="empty-text">${this.localize('notAssessed')}</div>`;
		}

		return html`
			${trendItems.map(this._renderTrendItem, this)}
			<p class="screen-reader">${this._getScreenReaderText(trendDataTruncated)}</p>
			${trendItems.map(this._renderTrendItemTooltip, this)}
		`;
	}

	_getAttemptGroupLabel(attempts) {
		return attempts
			.map(attempt => attempt.name || this.localize('indexedAttempt', { num: attempt.attemptIndex }))
			.join(', ');
	}

	_getMaxLevelScore(levels) {
		return Math.max.apply(null, Object.keys(levels).map(levelId => levels[levelId].score));
	}

	_getScreenReaderText(trendData) {
		if (!trendData || !trendData.levels || !trendData.groups) {
			return null;
		}

		const levels = trendData.levels;
		const trendGroups = trendData.groups;

		const numAssessed = trendGroups.reduce((acc, group) => acc + group.attempts.length, 0);
		const levelNames = trendGroups.reduce((acc, group) => acc.concat(group.attempts.map(attempt => levels[attempt.levelId].name)), []).join(', ');

		return this.localize('miniTrendScreenReaderText', 'numAssessed', numAssessed, 'levelNames', levelNames);
	}

	_getTrendItems(trendData) {
		if (!this._hasData(trendData)) {
			return [];
		}

		const levels = trendData.levels;
		const trendGroups = trendData.groups;
		const trendItems = [];
		const maxLevel = this._getMaxLevelScore(levels);

		trendGroups.forEach(group => {
			const blocks = [];
			const groupAttempts = group.attempts;
			const groupItem = {};

			// Compute levels achieved
			const groupLevels = groupAttempts
				.filter((val, index, self) => self.indexOf(val) === index)
				.sort((left, right) => levels[left.levelId].score - levels[right.levelId].score);
			const groupSize = groupLevels.length;

			// Add trend blocks to group
			let prevScore = 0;

			groupLevels.forEach(attempt => {
				const levelId = attempt.levelId;
				const color = levels[levelId].color;
				const height = COMPONENT_HEIGHT / maxLevel * (levels[levelId].score - prevScore) - BLOCK_SPACING * (groupSize - 1) / groupSize;
				prevScore = levels[levelId].score;

				blocks.push({
					color,
					height
				});
			}, this);

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

	_groupHasBlocks(group) {
		return group.blocks.length > 0;
	}

	_hasData(trendData) {
		return trendData !== null;
	}

	_hasMultipleAttempts(group) {
		return group.attempts.length > 0 && (group.attempts.length > 1 || group.attempts[0].attempts.length > 1);
	}

	_hasTrendData(trendData) {
		const blockGroups = this._getTrendItems(trendData);
		const numBlocks = blockGroups.reduce((acc, group) => acc + group.blocks.length, 0);
		return numBlocks > 0;
	}

	_isNotAssessed(trendData) {
		return this._hasData(trendData) && !this._hasTrendData(trendData);
	}

	_renderTrendItem(trendItem, index) {
		const blocks = trendItem.blocks.map(block => {
			if (block.height > 0) {
				return html`
					<div class="trend-block" style="height: ${block.height}px; background-color: ${block.color};"></div>
				`;
			}
			return null;
		});

		return html`
			<div class="trend-group" id="group${index}">
				${blocks}
			</div>
		`;
	}

	_renderTrendItemTooltip(trendItem, index) {
		let assessment = html`<div>${this.localize('notAssessed')}</div>`;

		if (this._groupHasBlocks(trendItem)) {
			assessment = trendItem.attempts.map(attemptGroup => {
				const groupLabel = this._hasMultipleAttempts(trendItem)
					? html`<b>${this._getAttemptGroupLabel(attemptGroup.attempts)}</b>:`
					: null;

				return html`
					<div>
						${groupLabel}
						${attemptGroup.name}
					</div>
				`;
			});
		}

		return html`
			<d2l-tooltip for="group${index}" position="top" offset="${TOOLTIP_POINTER_SIZE + TOOLTIP_GAP}">
				${assessment}	
			</d2l-tooltip>
		`;
	}

	_truncTrendData(trendData) {
		if (!this._hasData(trendData)) {
			return null;
		}

		const truncGroups = [];
		const trendGroups = trendData.groups;
		for (let i = trendGroups.length - 1; i >= 0; i--) {
			if (truncGroups.length === MAX_TREND_ITEMS) {
				break;
			}

			if (truncGroups.length === 0 && trendGroups[i].attempts.length === 0) {
				continue;
			}

			truncGroups.push(trendGroups[i]);
		}

		return {
			levels: trendData.levels,
			groups: truncGroups.reverse()
		};
	}

}

customElements.define(MiniTrend.is, MiniTrend);
