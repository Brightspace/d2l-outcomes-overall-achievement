import '@brightspace-ui/core/components/alert/alert-toast.js';
import '@brightspace-ui/core/components/alert/alert.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/dialog/dialog-confirm.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/inputs/input-search.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import '@brightspace-ui/core/components/typography/typography.js';
import 'd2l-table/d2l-scroll-wrapper.js';
import 'd2l-table/d2l-table.js';
import '../custom-icons/LeftArrow.js';
import '../custom-icons/RightArrow.js';
import './mastery-view-outcome-header-cell.js';
import './mastery-view-user-outcome-cell.js';
import { css, html, LitElement } from 'lit-element';
import { announce } from '@brightspace-ui/core/helpers/announce.js';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles';
import { ClassOverallAchievementEntity } from '../entities/ClassOverallAchievementEntity.js';
import { Consts } from '../consts';
import { d2lTableStyles } from '../custom-styles/d2l-table-styles';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { ErrorLogger } from '../ErrorLogger.js';
import { ifDefined } from 'lit-html/directives/if-defined';
import Images from '../images/images.js';
import { linkStyles } from '@brightspace-ui/core/components/link/link.js';
import { LocalizeMixin } from '../LocalizeMixin';
import { performSirenAction } from 'siren-sdk/src/es6/SirenAction.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';
import { TelemetryMixin } from '../TelemetryMixin';

const BULK_RELEASE_ACTION = 'release';
const BULK_RETRACT_ACTION = 'retract';
const DEFAULT_ROW_SIZE = 20;
const PAGE_ROW_SIZES = [10, 20, 30, 50, 100, 200];

const _naturalStringCompare = function(a, b) {
	return (a || '').localeCompare(b || '', undefined, { numeric: true });
};

const _getOutcomePrefix = function(outcome) {
	if (!outcome) {
		return null;
	}

	if (outcome.altNotation && outcome.altNotation.trim()) {
		return outcome.altNotation.trim();
	}

	if (outcome.notation && outcome.notation.trim()) {
		return outcome.notation.trim();
	}

	if (outcome.label && outcome.label.trim()) {
		if (outcome.listId && outcome.listId.trim()) {
			return `${outcome.label.trim()} ${outcome.listId.trim()}`;
		}
		return outcome.label.trim();
	}

	if (outcome.listId && outcome.listId.trim()) {
		return outcome.listId.trim();
	}

	return '';
};

const _compareOutcomes = function(a, b) {
	if (!a) {
		return b ? 0 : 1;
	} else if (!b) {
		return -1;
	}

	if (a.href === b.href) {
		return 0;
	}

	const prefixComparison = _naturalStringCompare(a.prefix, b.prefix);
	if (prefixComparison !== 0) {
		return prefixComparison;
	}

	const descriptionComparison = _naturalStringCompare(a.description, b.description);
	if (descriptionComparison !== 0) {
		return descriptionComparison;
	}

	return a.href < b.href ? -1 : 1;
};

class MasteryViewTable extends EntityMixinLit(LocalizeMixin(TelemetryMixin(LitElement))) {

	static get properties() {
		return {
			errorLoggingEndpoint: {
				type: String,
				value: null
			},
			outcomesToolLink: {
				type: String,
				attribute: 'outcomes-tool-link'
			},
			outcomeTerm: {
				type: String,
				attribute: 'outcome-term'
			},
			showFirstUse: {
				type: Boolean,
				attribute: 'show-first-use'
			},
			settingPageLocation: {
				type: String,
				attribute: 'setting-page-link'
			},
			telemetryEndpoint: {
				type: String,
				attribute: 'telemetry-endpoint'
			},
			_calculationMethod: { attribute: false },
			_logger: { attribute: false },
			_learnerList: { attribute: false },
			_filteredLearnerList: { attribute: false },
			_outcomeHeadersData: { attribute: false },
			_learnerRowsData: { attribute: false },
			_rowsPerPage: { attribute: false },
			_currentPage: { attribute: false },
			_pageCount: { attribute: false },
			_showFirstNames: { attribute: false },
			_showLastNames: { attribute: false },
			_nameFirstLastFormat: { attribute: false },
			_sortDesc: { attribute: false },
			_searchTerm: { attribute: false },
			_skeletonLoaded: { attribute: false },
			_hasErrors: { attribute: false },
			_stickyHeadersEnabled: { attribute: false },
			_bulkReleaseAction: { attribute: false },
			_bulkRetractAction: { attribute: false },
			_showBulkActionDialog: { attribute: false },
			_displayReleasedToast: { attribute: false },
			_displayRetractedToast: { attribute: false }
		};
	}

	static get styles() {
		return [
			css`
				.d2l-alert-container {
					padding-bottom: 18px;
				}

				#no-outcomes-container {
					width: 100%;
					display: flex;
					align-items: center;
					flex-direction: column;
					margin-bottom: 100px;
				}

				#no-outcomes-container img {
					height: 357px;
					width: 479px;
				}

				#no-outcomes-container div {
					margin-top: 30px;
					text-align: center;
				}

				.d2l-table {
					width: auto !important;
					max-width: 100%;
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

				#upper-controls-container {
					border-spacing: 0px;
					width: 60vw;
					display: flex;
					flex-direction: column;
				}

				:host([dir="rtl"]) #search-input {
					margin-right: 0;
					margin-left: 24px;
				}

				#search-input {
					max-width: 270px;
					margin-bottom: 18px;
					margin-right: 24px;
				}

				.msg-container {
					border-radius: 8px;
					background-color: var(--d2l-color-regolith);
					border: 1px solid var(--d2l-color-gypsum);
					color: var(--d2l-color-ferrite);
					margin-bottom: 18px;
					display: block;
				}

				.msg-container
				.msg-container-text {
					padding: 10px 20px;
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

				#bulk-action {
					margin-bottom: 18px;
				}

				@media (min-width: 768px) {
					.sticky-headers {
						position: sticky;
						left: 2.439%;
					}

					:host([dir="rtl"]) .sticky-headers {
						left: unset;
						right: 2.439%;
					}
				}

				@media (min-width: 1230px) {
					.sticky-headers {
						position: sticky;
						left: 30px;
					}

					:host([dir="rtl"]) .sticky-headers {
						left: unset;
						right: 30px;
					}
				}
			`,
			d2lTableStyles,
			linkStyles,
			selectStyles,
			bodyCompactStyles
		];
	}

	constructor() {
		super();
		this._setEntityType(ClassOverallAchievementEntity);

		this._outcomeHeadersData = [];
		this._learnerRowsData = [];
		this._learnerList = [];
		this._filteredLearnerList = [];
		this._rowsPerPage = DEFAULT_ROW_SIZE;
		this._currentPage = 1;
		this._pageCount = 1;
		this._showFirstNames = false;
		this._showLastNames = false;
		this._nameFirstLastFormat = false;
		this._sortDesc = false;
		this._skeletonLoaded = false;
		this._hasErrors = null;
		this._resizeHandler = undefined;
		this._stickyHeadersEnabled = false;
		this._searchTerm = '';
		this._bulkReleaseAction = {};
		this._bulkRetractAction = {};
		this._showBulkActionDialog = false;
		this._displayReleasedToast = false;
		this._displayRetractedToast = false;
		this._calculationMethod = null;
		this._completedCellCount = 0;
		this._logger = new ErrorLogger(
			() => this.errorLoggingEndpoint,
			() => { this._hasErrors = true; }
		);

		this._onCellLoaded = this._onCellLoaded.bind(this);
		this._onResize = this._onResize.bind(this);
	}

	static get is() { return 'd2l-mastery-view-table'; }

	connectedCallback() {
		super.connectedCallback();

		this.markMasteryViewLoadStart();

		window.addEventListener('resize', this._onResize);
		window.addEventListener('error', this._logger.logJavascriptError);
		window.addEventListener('unhandledrejection', this._logger.logPromiseError);

		this.addEventListener(Consts.events.masteryViewCellLoaded, this._onCellLoaded);
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		window.removeEventListener('resize', this._onResize);
		window.removeEventListener('error', this._logger.logJavascriptError);
		window.removeEventListener('unhandledrejection', this._logger.logPromiseError);

		this.removeEventListener(Consts.events.masteryViewCellLoaded, this._onCellLoaded);
	}

	render() {
		if (!this._hasErrors) {
			if (!this._skeletonLoaded) {
				// Basic table outline (classlist, aligned outcomes) still loading - hold off on rendering
				return null;
			}

			if (this._outcomeHeadersData.length === 0) {
				// Empty state for no aligned outcomes
				return html`
					<div id="no-outcomes-container" class="d2l-typography">
						<img src=${Images['blueprint']} />
						<div class="d2l-body-compact">
							${this.localize('noAlignedOutcomes', 'outcome', this.outcomeTerm)}
						</div>
						<div class="d2l-body-compact">
							<a href=${this.outcomesToolLink} class="d2l-link">${this.localize('viewCourseIntentList', 'outcome', this.outcomeTerm)}</a>
						</div>
					</div>
				`;
			}
		}

		return html`
			${this._hasErrors && this._renderErrorAlert()}
			${this.showFirstUse && this._renderFirstUseAlert(this._calculationMethod, this.settingPageLocation)}
			${this._renderUpperControls()}
			${this._renderTable()}
			<d2l-dialog-confirm
				text=${this.localize('releaseAllTxt')}
				?opened=${this._showBulkActionDialog && !!this._bulkReleaseAction}
				@d2l-dialog-close=${this._onBulkActionDialogClose}
			>
				<d2l-button slot="footer" primary data-dialog-action=${BULK_RELEASE_ACTION}>${this.localize('releaseAllBtn')}</d2l-button>
				<d2l-button slot="footer" data-dialog-action>${this.localize('cancelBtn')}</d2l-button>
			</d2l-dialog-confirm>
			<d2l-dialog-confirm
				text=${this.localize('retractAllTxt')}
				?opened=${this._showBulkActionDialog && !!this._bulkRetractAction}
				@d2l-dialog-close=${this._onBulkActionDialogClose}
			>
				<d2l-button slot="footer" primary data-dialog-action=${BULK_RETRACT_ACTION}>${this.localize('retractAllBtn')}</d2l-button>
				<d2l-button slot="footer" data-dialog-action>${this.localize('cancelBtn')}</d2l-button>
			</d2l-dialog-confirm>
			${this._renderToast(this._displayReleasedToast, this.localize('toastReleased'))}
			${this._renderToast(this._displayRetractedToast, this.localize('toastRetracted'))}
		`;
	}

	updated(changedProperties) {
		this._onResize();

		if (changedProperties.has('_learnerList')) {
			this._filteredLearnerList = this._filterLearnerList(this._learnerList, this._searchTerm);
		}

		if (changedProperties.has('_filteredLearnerList')) {
			this._updatePageCount();
		}

		if (changedProperties.has('_learnerRowsData')) {
			this._completedCellCount = 0;
		}

		if (changedProperties.has('telemetryEndpoint')) {
			this.setTelemetryEndpoint(this.telemetryEndpoint);
		}
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	_bulkButtonClick() {
		this._showBulkActionDialog = true;
	}

	_doActionNow(action) {
		return performSirenAction(this.token, action, null, true).catch(error => {
			this._logger.logSirenError(action.href, action.method, error);
			throw error;
		});
	}

	_filterLearnerList(learnerList, searchTerm) {
		return learnerList.filter((learnerInfo) => {
			const searchText = this._getUserNameText(learnerInfo.firstName, learnerInfo.lastName, this._nameFirstLastFormat).displayText.toLowerCase();
			return (searchText.search(searchTerm.toLowerCase()) !== -1);
		});
	}

	_getLearnerHeadAriaLabel(isLastName, isSecondButton) {
		const newSortKey = isLastName ? this.localize('lastName') : this.localize('firstName');

		let currentSortKey, newSortDirection;
		if (isSecondButton) {
			newSortDirection = this.localize('ascending');
			currentSortKey = isLastName ? this.localize('firstName') : this.localize('lastName');
		}
		else {
			newSortDirection = this._sortDesc ? this.localize('ascending') : this.localize('descending');
			currentSortKey = newSortKey;
		}

		const currentSortDirection = this._sortDesc ? this.localize('descending') : this.localize('ascending');

		return this.localize(
			'learnerSortButtonDescription',
			'newSortKey', newSortKey,
			'newSortDirection', newSortDirection,
			'currentSortKey', currentSortKey,
			'currentSortDirection', currentSortDirection
		);
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

	_getPaginationControlsClass() {
		const classes = [];
		if (this._stickyHeadersEnabled) {
			classes.push('sticky-headers');
		}

		return classes.join(' ');
	}

	_getSearchResultsText() {
		return this.localize('searchResults', 'numResults', this._filteredLearnerList.length);
	}

	_getStickyContainers() {
		const containers = [];
		const title = document.querySelector('.d2l-outcomes-gradebook-header');
		const paginationControls = this.shadowRoot.querySelector('#pagination-controls-outer-container');
		const upperControls = this.shadowRoot.querySelector('#upper-controls-outer-container');
		if (title) {
			containers.push(title);
		}
		if (paginationControls) {
			containers.push(paginationControls);
		}
		if (upperControls) {
			containers.push(upperControls);
		}
		return containers;
	}

	_getUpperControlsClass() {
		const classes = [];
		if (this._stickyHeadersEnabled) {
			classes.push('sticky-headers');
		}

		return classes.join(' ');
	}

	_getUserNameText(firstName, lastName, firstLastDisplay) {
		let displayText, ariaText;

		if (!firstName && !lastName) {
			displayText = this.localize('anonymousUser');
		}
		else if (!firstName) {
			displayText = lastName;
		}
		else if (!lastName) {
			displayText = firstName;
		}
		else if (firstLastDisplay) {
			displayText = `${firstName} ${lastName}`;
		}
		else {
			displayText = `${lastName}, ${firstName}`;
		}

		if (firstName && lastName) {
			ariaText = `${firstName} ${lastName}`;
		}
		else {
			ariaText = displayText;
		}

		const text = {
			displayText,
			ariaText
		};
		return text;
	}

	_goToPageNumber(newPage) {
		this._currentPage = newPage;
		const selector = this.shadowRoot.getElementById('page-select-menu');
		if (selector) {
			selector.selectedIndex = newPage - 1;
		}
		this._learnerRowsData = this._getLearnerRowsData(this._filteredLearnerList, this._currentPage, this._rowsPerPage);
	}

	_onBulkActionDialogClose(e) {
		this._showBulkActionDialog = false;

		if (e.detail.action === BULK_RELEASE_ACTION) {
			this._doActionNow(this._bulkReleaseAction).then(() => {
				this._displayReleasedToast = true;
				location.reload();
			});
		} else if (e.detail.action === BULK_RETRACT_ACTION) {
			this._doActionNow(this._bulkRetractAction).then(() => {
				this._displayRetractedToast = true;
				location.reload();
			});
		}
	}

	_onCellLoaded() {
		const targetCells = this._learnerRowsData.length * this._outcomeHeadersData.length;

		if (!targetCells) {
			return;
		}

		if (++this._completedCellCount === targetCells) {
			this.markMasteryViewLoadEnd();
		}
	}

	_onEntityChanged(entity, error) {
		if (!entity) {
			this._logger.logSirenError(this.href, 'GET', error);
			return;
		}
		const learnerInfoList = [];
		const outcomeHeadersData = [];
		const bulkReleaseAction = entity.getBulkReleaseAction();
		const bulkRetractAction = entity.getBulkRetractAction();

		// Prime cache with achievement scale
		entity.onDefaultScaleChanged(() => { /* Do nothing */ });

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
					description: outcome.getDescription(),
					prefix: _getOutcomePrefix(outcome._entity.properties)
				};
				outcomeHeadersData.push(outcomeData);
			}, error => {
				this._logger.logSirenError(outcomeProgressEntity.self(), 'GET', error);
			});
		});

		let calculationMethodEntity = null;

		entity.onCalculationMethodChanged(calculationMethod => {
			if (!calculationMethod) {
				return;
			}

			calculationMethodEntity = calculationMethod;
		}, error => {
			this._logger.logSirenError(entity.getCalculationMethodHref(), 'GET', error);
		});

		entity.onClasslistChanged(classlist => {
			if (!classlist) {
				return;
			}

			const coaUserEntities = classlist.getUsers();
			let showFirstNames = false;
			let showLastNames = false;
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

				if (firstName) {
					showFirstNames = true;
				}
				if (lastName) {
					showLastNames = true;
				}
			});

			classlist.subEntitiesLoaded().then(() => {
				this._showFirstNames = showFirstNames;
				this._showLastNames = showLastNames;
				this._learnerList = this._sortLearners(learnerInfoList, !this._nameFirstLastFormat, this._sortDesc);
			});
		}, error => {
			this._logger.logSirenError(entity._classlistHref(), 'GET', error);
		});

		entity.subEntitiesLoaded().then(() => {
			outcomeHeadersData.sort(_compareOutcomes);
			this._outcomeHeadersData = outcomeHeadersData;
			this._bulkReleaseAction = bulkReleaseAction;
			this._bulkRetractAction = bulkRetractAction;
			this._calculationMethod = calculationMethodEntity;
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
		const selector = this.shadowRoot.getElementById('page-select-menu');
		const newPageNumber = parseInt(selector.options[selector.selectedIndex].value);
		this._goToPageNumber(newPageNumber);
	}

	_onPageSizeDropdownSelectionChanged() {
		const selector = this.shadowRoot.getElementById('page-size-menu');
		const newRowsPerPage = parseInt(selector.options[selector.selectedIndex].value);
		this._rowsPerPage = newRowsPerPage;
		this._updatePageCount();
	}

	_onPreviousPageButtonClicked() {
		if (this._currentPage > 1) {
			this._goToPageNumber(this._currentPage - 1);
		}
	}

	_onResize() {
		if (this._resizeHandler) {
			clearTimeout(this._resizeHandler);
		}

		this._resizeHandler = setTimeout(this._setStickyWidth.bind(this), 100);
	}

	//Switches between first-last or last-first format and sorts ascending
	_onSecondLearnerHeaderButtonClicked() {
		this._nameFirstLastFormat = !this._nameFirstLastFormat;
		this._sortDesc = false;
		this._updateSortOrder();
	}

	_onToastClose() {
		this._displayReleasedToast = false;
		this._displayRetractedToast = false;
	}

	_renderBulkButtons() {
		const text = this._bulkReleaseAction ? this.localize('releaseAllBtn') : this.localize('retractAllBtn');
		const buttonAction = this._bulkButtonClick;
		return !!this._bulkReleaseAction || !!this._bulkRetractAction ? html`<d2l-button id='bulk-action' @click=${buttonAction} >${text}</d2l-button>` : html``;
	}

	_renderErrorAlert() {
		return html`
			<div class="d2l-alert-container">
				<d2l-alert type="error">
					${this.localize('masteryViewTableEmptyError')}
				</d2l-alert>
			</div>
		`;
	}

	_renderFirstUseAlert(calculationMethodEntity, mvSettingsLocation) {
		const toastMessageText = calculationMethodEntity
			? this.localize('firstUseAlertToastMessage', 'calculationMethod', calculationMethodEntity.getName())
			: this.localize('firstUseAlertToastMessageNone');

		return html`
			<div class="d2l-alert-container">
				<d2l-alert has-close-button>
					<div>${toastMessageText}</div>
					<d2l-link small href=${mvSettingsLocation}>${this.localize('firstUseAlertSettingPageMessage')}</d2l-link>
				</d2l-alert>
			</div>
		`;
	}

	_renderLearnerColumnHead(showFirstNames, showLastNames, nameFirstLastFormat) {
		const firstNameFirstButton = this._renderLearnerColumnSortButton(false, false);
		const firstNameSecondButton = this._renderLearnerColumnSortButton(true, false);
		const lastNameFirstButton = this._renderLearnerColumnSortButton(false, true);
		const lastNameSecondButton = this._renderLearnerColumnSortButton(true, true);

		let cellContent;

		if (!showFirstNames && !showLastNames) {
			cellContent = this.localize('name');
		} else if (!showFirstNames) {
			cellContent = lastNameFirstButton;
		} else if (!showLastNames) {
			cellContent = firstNameFirstButton;
		} else if (nameFirstLastFormat) {
			cellContent = html`
				${firstNameFirstButton}, ${lastNameSecondButton}
			`;
		} else {
			cellContent = html`
				${lastNameFirstButton}, ${firstNameSecondButton}
			`;
		}

		return html`
			<th sticky>
			<div class="learner-column-head">
				${cellContent}
			</div></th>
		`;
	}

	_renderLearnerColumnSortButton(isSecondButton, isLastName) {
		const text = isLastName ? this.localize('lastName') : this.localize('firstName');
		const ariaLabel = this._getLearnerHeadAriaLabel(isLastName, isSecondButton);
		const clickCallback = isSecondButton ? this._onSecondLearnerHeaderButtonClicked : this._onFirstLearnerHeaderButtonClicked;
		return html`
			<d2l-table-col-sort-button
				?desc=${this._sortDesc}
				?nosort=${isSecondButton}
				@click=${clickCallback}
				role="region"
				aria-label=${ariaLabel}
			>
				${text}
			</d2l-table-col-sort-button>
		`;
	}

	_renderLearnerRow(learnerData, outcomeHeaderData) {
		const userNameText = this._getUserNameText(learnerData.firstName, learnerData.lastName, this._nameFirstLastFormat);
		if (outcomeHeaderData.length === 0 || !learnerData.rowDataHref) {
			return this._renderNoLearnerState(this.localize('learnerHasNoData', 'username', `${learnerData.firstName} ${learnerData.lastName}`));
		}

		return html`
		<tr>
			<th scope="row" sticky class="learner-name-cell">
				<div class="learner-name-container">
					<a
						href="${learnerData.gradesPageHref}"
						class="d2l-link learner-name-label"
						role="region"
						aria-label=${this.localize('goToUserAchievementSummaryPage', 'name', userNameText.ariaText)}
						title=${userNameText.displayText}
					>
						${userNameText.displayText}
					</a>
				</div>
			</th>
			${outcomeHeaderData.map(outcomeData => html`
				<td role="cell" class="learner-outcome-cell">
					<d2l-mastery-view-user-outcome-cell
						href=${learnerData.rowDataHref}
						token=${this.token}
						outcome-href=${outcomeData.href}
						._logger="${this._logger}"
					/>
				</td>
			`)}
		</tr>
		`;
	}

	_renderNoLearnerState(rowText) {
		//1 column per outcome, plus learner column, plus (later) checkbox column
		const colSpan = this._outcomeHeadersData.length + 1;
		return html`
			<tr>
				<td id="no-learners-cell" colspan="${colSpan}">
					<div class="no-learners-label">${rowText}</div>
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
				outcome-name="${ifDefined(outcomeData.name)}"
				outcome-description="${ifDefined(outcomeData.description)}"
				tooltip-align="${tooltipAlign}"
				display-unassessed
				aria-label="${this.localize('outcomeInfo', 'name', outcomeData.name, 'description', outcomeData.description)}"
			/>
		</th>`;

	}

	_renderSearchMessage() {
		if (this._searchTerm) {
			return html`
				<div class="msg-container">
					<div class="msg-container-text">
						<label>
							${this._getSearchResultsText()}
						</label>
					</div>
				</div>
			`;
		}
	}

	_renderTable() {
		if (this._learnerList.length === 0 || this._filteredLearnerList.length !== 0) {
			return html`
			<d2l-table-wrapper
				?sticky-headers=${this._stickyHeadersEnabled}
				show-actions
				type="default"
			>
				<table
					class="d2l-table"
					role="grid"
					aria-label="${this.localize('masteryViewTableDescription')}"
				>
					<thead>
						${this._renderTableHead(this._showFirstNames, this._showLastNames, this._nameFirstLastFormat, this._outcomeHeadersData)}
					</thead>
					<tbody>
						${this._renderTableBody(this._outcomeHeadersData, this._learnerRowsData)}
					</tbody>
				</table>
			</d2l-table-wrapper>
			${this._renderTableControls()}
			`;
		}
	}

	_renderTableBody(outcomeHeaderData, rowsData) {
		if (this._skeletonLoaded && rowsData.length === 0) {
			return this._renderNoLearnerState(this.localize('noEnrolledLearners'));
		}
		return rowsData.map(item => this._renderLearnerRow(item, outcomeHeaderData));
	}

	_renderTableControls() {
		if (this._filteredLearnerList.length <= this._rowsPerPage) {
			return null;
		}
		const pageSelectOptionTemplates = [];
		for (let i = 1; i <= this._pageCount; i++) {
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
		<div id="pagination-controls-outer-container">
			<table id="pagination-controls-container" class="${this._getPaginationControlsClass()}" aria-hidden="true">
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
		</div>
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

	_renderTableHead(showFirstNames, showLastNames, nameFirstLastFormat, outcomeHeadersData) {
		return html`
		<tr header>
			${this._renderLearnerColumnHead(showFirstNames, showLastNames, nameFirstLastFormat)}
			${outcomeHeadersData.map((item, index) => { return this._renderOutcomeColumnHead(item, index); })}
		</tr>
		`;
	}

	_renderToast(opened, text) {
		return html`<d2l-alert-toast
			?open=${opened}
			button-text=""
			@d2l-alert-toast-close=${this._onToastClose}>${text}</d2l-alert-toast>`;
	}

	_renderUpperControls() {
		if (this._learnerList.length === 0) {
			return null;
		}

		return html`
		<div id="upper-controls-outer-container">
			<div id="upper-controls-container" class=${this._getUpperControlsClass()}>
				<div id="search-publish-container">
					<d2l-input-search
						id="search-input"
						label="${this.localize('searchUsersLabel')}"
						placeholder="${this.localize('searchUsersPlaceholder')}"
						@d2l-input-search-searched=${this._searchUsers}
					></d2l-input-search>
					${this._renderBulkButtons()}
				</div>
				${this._renderSearchMessage()}
			</div>
		</div>
		`;
	}

	_searchUsers(e) {
		const searchText = e.detail.value;
		this._searchTerm = searchText ? searchText.toLowerCase() : '';
		this._filteredLearnerList = this._filterLearnerList(this._learnerList, this._searchTerm);

		announce(this._getSearchResultsText());
	}

	_setStickyHeaders(enable) {
		if (enable) {
			this._stickyHeadersEnabled = true;
		} else {
			this._stickyHeadersEnabled = false;
		}
	}

	_setStickyWidth() {
		requestAnimationFrame(() => {
			const header = document.querySelector('header');
			const containers = this._getStickyContainers();

			if (header) {
				header.style.width = null;
			}
			containers.forEach((container) => {
				container.style.width = null;
			});

			if (window.innerWidth < 780) {
				this._setStickyHeaders(false);
				return;
			}

			this._setStickyHeaders(true);

			const bodyWidth = Math.max(document.body.scrollWidth, document.body.offsetWidth);
			const containerWidth = bodyWidth < 1230
				? bodyWidth - (bodyWidth * 0.02439 * 2)
				: bodyWidth - 60;
			if (header) {
				header.style.width = `${bodyWidth}px`;
			}
			containers.forEach((container) => {
				container.style.width = `${containerWidth}px`;
			});
		});
	}

	_shouldShowNextPageButton() {
		return this._currentPage < this._pageCount;
	}

	_shouldShowPrevPageButton() {
		return this._currentPage > 1;
	}

	_sortLearners(list, byLastName, descending) {
		const sortedList = [...list].sort((left, right) => {
			let leftSortString = '';
			let rightSortString = '';

			const leftFirst = left.firstName || '';
			const leftLast = left.lastName || '';
			const rightFirst = right.firstName || '';
			const rightLast = right.lastName || '';

			if (byLastName) {
				leftSortString = `${leftLast}_${leftFirst}`;
				rightSortString = `${rightLast}_${rightFirst}`;
			}
			else {
				leftSortString = `${leftFirst}_${leftLast}`;
				rightSortString = `${rightFirst}_${rightLast}`;
			}

			if (descending) {
				return rightSortString.localeCompare(leftSortString);
			}
			else {
				return leftSortString.localeCompare(rightSortString);
			}
		});
		return sortedList;
	}

	_updatePageCount() {
		const learnerCount = this._filteredLearnerList.length;
		if (learnerCount === 0) {
			this._pageCount = 1;
		}
		else {
			this._pageCount = Math.ceil(learnerCount / this._rowsPerPage);
		}

		if (this._currentPage > this._pageCount) {
			this._goToPageNumber(this._pageCount);
		}
		this._learnerRowsData = this._getLearnerRowsData(this._filteredLearnerList, this._currentPage, this._rowsPerPage);
	}

	_updateSortOrder() {
		this._learnerList = this._sortLearners(this._learnerList, !this._nameFirstLastFormat, this._sortDesc);
	}

}

customElements.define(MasteryViewTable.is, MasteryViewTable);
