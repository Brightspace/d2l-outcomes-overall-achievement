import { LitElement, html, css } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { ClassOverallAchievementEntity } from '../entities/ClassOverallAchievementEntity.js';
import './mastery-view-user-outcome-cell.js';
import './mastery-view-outcome-header-cell.js';

import { d2lTableStyles } from '../custom-styles/d2l-table-styles';
import { linkStyles } from '@brightspace-ui/core/components/link/link.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

import '../custom-icons/LeftArrow.js';
import '../custom-icons/RightArrow.js';

import 'd2l-table/d2l-table.js';
import 'd2l-table/d2l-scroll-wrapper.js';

import '@brightspace-ui/core/components/typography/typography.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/link/link.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';

const DEFAULT_ROW_SIZE = 20;
const PAGE_ROW_SIZES = [10, 20, 30, 50, 100, 200];

class MasteryViewTable extends EntityMixinLit(LocalizeMixin(LitElement)) {
	static get is() { return 'd2l-mastery-view-table'; }

	static get properties() {
		return {
			_learnerList: Array,

			_outcomeHeadersData: Array,
			_learnerRowsData: Array,

			_rowsPerPage: Number,
			_currentPage: Number,
			_pageCount: Number,

			_nameFirstLastFormat: Boolean,
			_sortDesc: Boolean,

			_skeletonLoaded: Boolean
		};
	}

	static get styles() {
		return [
			css`
				#scroll-wrapper {
					--d2l-scroll-wrapper-h-scroll: {
						border-left: 1px dashed var(--d2l-color-mica);
						border-right: 1px dashed var(--d2l-color-mica);
					};

					--d2l-scroll-wrapper-left: {
						border-left: none;
					};

					--d2l-scroll-wrapper-right: {
						border-right: none;
					};

					--d2l-scroll-wrapper-border-color: var(--d2l-color-mica);
					--d2l-scroll-wrapper-background-color: var(--d2l-color-regolith);
				}

				.learner-column-head {
					padding: 0rem 0.8rem;
					min-width: 9.9rem;
					max-width: 25.6rem;
				}

				.outcome-column-head {
					vertical-align: bottom;
					width: 9.9rem;
				}

				.learner-name-cell {
					height: 3rem;
					max-width: 25.6rem;
				}

				.learner-name-container {
					display: flex;
				}

				.learner-name-label {
					padding: 0rem 0.8rem;
					line-height: 3rem;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.learner-name-label:focus {
					outline: 0;
					text-decoration: underline;
				}
				
				.learner-outcome-cell {
					width: 9.9rem;
				}

				#no-learners-cell {
					border-radius: 0;
					border-bottom: 1px solid var(--d2l-table-border-color);
				}

				.no-learners-label {
					padding: 0rem 0.8rem;
					line-height: 3rem;
				}

				#pagination-controls-container {
					margin-top: 0.9rem;
					margin-bottom: 2.1rem;
				}

				#page-label {
					margin-left: 0.35rem;
				}

				:host([dir="rtl"]) #page-label {
					margin-left: 0;
					margin-right: 0.35rem;
				}

				#page-select-menu {
					margin-right: 0.35rem;
				}

				:host([dir="rtl"]) #page-select-menu {
					margin-right: 0;
					margin-left: 0.35rem;
				}

				#page-size-menu {
					margin-left: 1.8rem;
				}

				:host([dir="rtl"]) #page-size-menu {
					margin-left: 0;
					margin-right: 1.2rem;
				}

				.page-label {
					height: 2.1rem;
				}

				.page-select-menu,
				.page-size-menu {
					height: 2.1rem;
				}
			`,
			d2lTableStyles,
			linkStyles,
			selectStyles
		];
	}

	constructor() {
		super();
		this._outcomeHeadersData = [];
		this._learnerRowsData = [];
		this._learnerList = [];
		this._rowsPerPage = DEFAULT_ROW_SIZE;
		this._currentPage = 1;
		this._pageCount = 1;
		this._nameFirstLastFormat = false;
		this._sortDesc = false;
		this._skeletonLoaded = false;
		this._setEntityType(ClassOverallAchievementEntity);
	}

	render() {
		if (!this._skeletonLoaded) {
			//Basic table outline (classlist, aligned outcomes) still loading - hold off on rendering
			return null;
		}

		if (this._outcomeHeadersData.length === 0) {
			//TODO: render empty state for no aligned outcomes, OR propagate an event
			return null;
		}

		return html`
			<d2l-scroll-wrapper id="scroll-wrapper" show-actions>
				<d2l-table-wrapper sticky-headers show-actions type="default">
					<table
						class="d2l-table"
						role="grid"
						aria-label="${this.localize('masteryViewTableDescription')}"
					>
						<thead>
							${this._renderTableHead(this._nameFirstLastFormat, this._outcomeHeadersData)}
						</thead>
						<tbody>
							${this._renderTableBody(this._outcomeHeadersData, this._learnerRowsData)}
						<tbody>
					</table>
				</d2l-table-wrapper>
			</d2l-scroll-wrapper>
			${this._renderTableControls()}
		`;
	}
	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	_getLearnerHeadLabelDescription(isSecondButton) {

		let newSortKey, newSortDirection;
		if (isSecondButton) {
			newSortKey = this._nameFirstLastFormat ? this.localize('lastName') : this.localize('firstName');
			newSortDirection = this.localize('ascending');
		}
		else {
			newSortKey = this._nameFirstLastFormat ? this.localize('firstName') : this.localize('lastName');
			newSortDirection = this._sortDesc ? this.localize('ascending') : this.localize('descending');
		}

		const currentSortKey = this._nameFirstLastFormat ? this.localize('firstName') : this.localize('lastName');
		const currentSortDirection = this._sortDesc ? this.localize('descending') : this.localize('ascending');

		return this.localize(
			'learnerSortButtonDescription',
			'newSortKey', newSortKey,
			'newSortDirection', newSortDirection,
			'currentSortKey', currentSortKey,
			'currentSortDirection', currentSortDirection
		);
	}

	_getLearnerHeadLabelsText() {
		let labelStrings;
		if (this._nameFirstLastFormat) {
			labelStrings = {
				first: this.localize('firstName'),
				second: this.localize('lastName'),
				divider: ''
			};
		}
		else {
			labelStrings = {
				first: this.localize('lastName'),
				second: this.localize('firstName'),
				divider: ','
			};
		}
		return labelStrings;
	}

	_getLearnerRowsData(learnerInfoList, currentPage, rowsPerPage) {
		const firstRowIdx = (currentPage - 1) * rowsPerPage;
		const lastRowIdx = firstRowIdx + (rowsPerPage - 1);
		const list = learnerInfoList.slice(firstRowIdx, lastRowIdx + 1);
		return list;
	}

	_getPageNumberDropdownText() {
		return this.localize('pageNumberDropdownText',
			'currentPage', this._currentPage,
			'pageCount', this._pageCount
		);
	}

	_getPageSizeDropdownEntryText(rowsPerPage) {
		return this.localize('pageSizeDropdownText',
			'rowsPerPage', rowsPerPage
		);
	}

	_getUserNameDisplay(firstName, lastName, firstLastFormat) {
		if (firstLastFormat) {
			return firstName + ' ' + lastName;
		}
		else {
			return lastName + ', ' + firstName;
		}
	}

	_goToPageNumber(newPage) {
		this._currentPage = newPage;
		var selector = this.shadowRoot.getElementById('page-select-menu');
		selector.selectedIndex = newPage - 1;
		this._learnerRowsData = this._getLearnerRowsData(this._learnerList, this._currentPage, this._rowsPerPage);
	}

	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}

		const learnerInfoList = [];
		const outcomeHeadersData = [];
		const outcomeClassProgressEntities = entity.getOutcomeClassProgressItems();
		outcomeClassProgressEntities.map(outcomeProgressEntity => {

			const activityCollectionHref = outcomeProgressEntity.getOutcomeActivityCollectionHref();
			outcomeProgressEntity.onOutcomeChanged(outcome => {
				if (!outcome) {
					return;
				}

				const outcomeData = {
					href: outcome.getSelfHref(),
					activityCollectionHref: activityCollectionHref,
					name: outcome.getNotation(),
					description: outcome.getDescription()
				};
				outcomeHeadersData.push(outcomeData);
			});
		});

		entity.onClasslistChanged(classlist => {
			if (!classlist) {
				return;
			}

			const coaUserEntities = classlist.getUsers();
			//Resolve all user links to get first and last names, plus links to data
			coaUserEntities.map(coaUser => {
				if (!coaUser) {
					return;
				}

				const firstName = coaUser.getFirstName();
				const lastName = coaUser.getLastName();
				const rowDataHref = coaUser.getRowDataHref();
				const gradesPageHref = coaUser.getUserGradesSummaryHref();

				const learnerInfo = {
					firstName,
					lastName,
					gradesPageHref,
					rowDataHref
				};
				learnerInfoList.push(learnerInfo);
			});

			classlist.subEntitiesLoaded().then(() => {
				this._learnerList = this._sortLearners(learnerInfoList, !this._nameFirstLastFormat, this._sortDesc);
				this._learnerRowsData = this._getLearnerRowsData(this._learnerList, this._currentPage, this._rowsPerPage);
				this._updatePageCount();
			});
		});

		entity.subEntitiesLoaded().then(() => {
			outcomeHeadersData.sort((left, right) => {
				return left.href.localeCompare(right.href);
			});
			this._outcomeHeadersData = outcomeHeadersData;
			this._skeletonLoaded = true;
		});
	}

	//Switch the user sort order between ascending/descending
	_onFirstLearnerHeaderButtonClicked() {
		this._sortDesc = !this._sortDesc;
		this._updateSortOrder();
	}

	_onNextPageButtonClicked() {
		if (this._currentPage < this._pageCount) {
			this._goToPageNumber(this._currentPage + 1);
		}
	}

	_onPageSelectDropdownSelectionChanged() {
		var selector = this.shadowRoot.getElementById('page-select-menu');
		const newPageNumber = parseInt(selector.options[selector.selectedIndex].value);
		this._goToPageNumber(newPageNumber);
	}

	_onPageSizeDropdownSelectionChanged() {
		var selector = this.shadowRoot.getElementById('page-size-menu');
		const newRowsPerPage = parseInt(selector.options[selector.selectedIndex].value);
		this._rowsPerPage = newRowsPerPage;
		this._updatePageCount();
	}

	_onPreviousPageButtonClicked() {
		if (this._currentPage > 1) {
			this._goToPageNumber(this._currentPage - 1);
		}
	}

	//Switches between first-last or last-first format and sorts ascending
	_onSecondLearnerHeaderButtonClicked() {
		this._nameFirstLastFormat = !this._nameFirstLastFormat;
		this._sortDesc = false;
		this._updateSortOrder();
	}

	_renderLearnerColumnHead() {
		const nameLabels = this._getLearnerHeadLabelsText();
		return html`
			<th sticky>
				<div class="learner-column-head">
					<d2l-table-col-sort-button
						?desc=${this._sortDesc}
						@click="${this._onFirstLearnerHeaderButtonClicked}}"
						role="region"
						aria-label="${this._getLearnerHeadLabelDescription(false)}"
					>
						${nameLabels.first}
					</d2l-table-col-sort-button>
					${nameLabels.divider}
					<d2l-table-col-sort-button
						nosort
						@click="${this._onSecondLearnerHeaderButtonClicked}"
						role="region"
						aria-label="${this._getLearnerHeadLabelDescription(true)}"
					>
						${nameLabels.second}
					</d2l-table-col-sort-button>
				</div>
			</th>
		`;
	}

	_renderLearnerRow(learnerData, outcomeHeaderData) {
		const userNameDisplay = this._getUserNameDisplay(learnerData.firstName, learnerData.lastName, this._nameFirstLastFormat);

		return html`
		<tr>
			<th scope="row" sticky class="learner-name-cell">
				<div class="learner-name-container">
					<a
						href="${learnerData.gradesPageHref}"
						class="d2l-link learner-name-label"
						role="region"
						aria-label=${this.localize('goToUserAchievementSummaryPage', 'username', learnerData.firstName + ' ' + learnerData.lastName)}
						title=${userNameDisplay}
					>
						${userNameDisplay}
					</a>
				</div>
			</th>
			${outcomeHeaderData.map(outcomeData => html`
				<td role="cell" class="learner-outcome-cell">
					<d2l-mastery-view-user-outcome-cell
						href=${learnerData.rowDataHref}
						token=${this.token}
						outcome-href=${outcomeData.href}
					/>
				</td>
			`)}
		</tr>
		`;
	}

	_renderNoLearnerState() {
		//1 column per outcome, plus learner column, plus (later) checkbox column
		const colSpan = this._outcomeHeadersData.length + 1;
		return html`
			<tr>
				<td id="no-learners-cell" colspan="${colSpan}">
					<div class="no-learners-label">${this.localize('noEnrolledLearners')}</div>
				</td>
			</tr>
		`;
	}

	_renderOutcomeColumnHead(outcomeData, index) {
		let tooltipAlign = 'center';
		if (index === 0) {
			tooltipAlign = 'start';
		}
		else if (index === this._outcomeHeadersData.length - 1) {
			tooltipAlign = 'end';
		}

		return html`
		<th scope="col" class="outcome-column-head">
			<d2l-mastery-view-outcome-header-cell
				href="${outcomeData.activityCollectionHref}"
				token="${this.token}"
				outcome-name="${outcomeData.name}"
				outcome-description="${outcomeData.description}"
				tooltip-align="${tooltipAlign}"
				display-unassessed
				aria-label="${this.localize('outcomeInfo', 'name', outcomeData.name, 'description', outcomeData.description)}"
			/>
		</th>`;

	}

	_renderTableBody(outcomeHeaderData, rowsData) {
		if (this._skeletonLoaded && rowsData.length === 0) {
			return this._renderNoLearnerState();
		}
		return rowsData.map(item => this._renderLearnerRow(item, outcomeHeaderData));
	}

	_renderTableControls() {
		if (this._learnerList.length <= DEFAULT_ROW_SIZE) {
			return null;
		}
		const pageSelectOptionTemplates = [];
		for (var i = 1; i <= this._pageCount; i++) {
			pageSelectOptionTemplates.push(html`
				<option value=${i}>
					${this.localize('pageSelectOptionText', 'currentPage', i, 'pageCount', this._pageCount)}
				</option>
			`);
		}

		const pageSizeOptionTemplates = [];
		PAGE_ROW_SIZES.map(pageSize => {
			pageSizeOptionTemplates.push(html`
				<option value=${pageSize} ?selected=${pageSize === this._rowsPerPage}>
					${this.localize('pageSizeSelectOptionText', 'pageSize', pageSize)}
				</option>
			`);
		});

		return html`
		<table id="pagination-controls-container" aria-hidden="true">
			<tr>
				<td class="prev-page-button-container">
					<d2l-button-subtle
						class="prev-page-button"
						text=""
						?disabled=${!this._shouldShowPrevPageButton()}
						@click=${this._onPreviousPageButtonClicked}
						aria-label=${this.localize('goToPreviousPage')}
					>
						<d2l-icon-left-arrow ?hidden=${!this._shouldShowPrevPageButton()} />
					</d2l-button-subtle>
				</td>
				<td class="page-label-container">
					<div id="page-label">${this.localize('page')}</div>
				</td>
				<td class="page-select-menu-container">
					<select
						id="page-select-menu"
						class="d2l-input-select"
						@change=${this._onPageSelectDropdownSelectionChanged}}
						aria-label=${this.localize('selectTablePage')}
						aria-controls="new-page-select-live-text"
					>
						${pageSelectOptionTemplates}
					</select>
				</td>
				<td class="next-page-button-container">
					<d2l-button-subtle
						class="next-page-button"
						text=""
						?disabled=${!this._shouldShowNextPageButton()}
						@click=${this._onNextPageButtonClicked}
						aria-label=${this.localize('goToNextPage')}
					>
						<d2l-icon-right-arrow ?hidden=${!this._shouldShowNextPageButton()} />
					</d2l-button-subtle>
				</td>
				<td class="page-size-menu-container">
					<select
						id="page-size-menu"
						class="d2l-input-select"
						@change=${this._onPageSizeDropdownSelectionChanged}}
						aria-label=${this.localize('selectLearnersPerPage')}
						aria-controls="new-page-size-live-text"
					>
						${pageSizeOptionTemplates}
					</select>
				</td>
			<tr>
		</table>
		<div
			role="region"
			id="new-page-select-live-text"
			aria-live="polite"
			aria-label=${this.localize('newPageSelectLiveText', 'pageNum', this._currentPage, 'totalPages', this._pageCount)}
		/>
		<div
			role="region"
			id="new-page-size-live-text"
			aria-live="polite"
			aria-label=${this.localize('newPageSizeLiveText', 'pageSize', this._rowsPerPage)}
		/>
		`;
	}

	_renderTableHead(nameFirstLastFormat, outcomeHeadersData) {
		return html`
		<tr header>
			${this._renderLearnerColumnHead(nameFirstLastFormat)}
			${outcomeHeadersData.map((item, index) => { return this._renderOutcomeColumnHead(item, index); })}
		</tr>
		`;
	}

	_shouldShowNextPageButton() {
		return this._currentPage < this._pageCount;
	}

	_shouldShowPrevPageButton() {
		return this._currentPage > 1;
	}

	_sortLearners(list, byLastName, descending) {
		list.sort((left, right) => {
			let leftName, rightName;
			if (byLastName) {
				leftName = left.lastName;
				rightName = right.lastName;
			}
			else {
				leftName = left.firstName;
				rightName = right.firstName;
			}

			if (descending) {
				return rightName.localeCompare(leftName);
			}
			else {
				return leftName.localeCompare(rightName);
			}
		});
		return list;
	}

	_updatePageCount() {
		const learnerCount = this._learnerList.length;
		if (learnerCount === 0) {
			this._pageCount = 1;
		}
		else {
			this._pageCount = Math.ceil(learnerCount / this._rowsPerPage);
		}

		if (this._currentPage > this._pageCount) {
			this._goToPageNumber(this._pageCount);
		}
		this._learnerRowsData = this._getLearnerRowsData(this._learnerList, this._currentPage, this._rowsPerPage);
	}

	_updateSortOrder() {
		this._learnerList = this._sortLearners(this._learnerList, !this._nameFirstLastFormat, this._sortDesc);
		this._learnerRowsData = this._getLearnerRowsData(this._learnerList, this._currentPage, this._rowsPerPage);
	}

}

customElements.define(MasteryViewTable.is, MasteryViewTable);
