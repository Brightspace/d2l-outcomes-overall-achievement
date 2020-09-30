import { LitElement, html, css } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { ClassOverallAchievementEntity } from '../entities/ClassOverallAchievementEntity.js';
import './mastery-view-user-outcome-cell.js';
import './mastery-view-outcome-header-cell.js';

import { d2lTableStyles } from '../custom-styles/d2l-table-styles';
import { linkStyles } from '@brightspace-ui/core/components/link/link.js';

import 'd2l-table/d2l-table.js';
import 'd2l-table/d2l-scroll-wrapper.js';

import '@brightspace-ui/core/components/typography/typography.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/link/link.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';

class MasteryViewTable extends EntityMixinLit(LocalizeMixin(LitElement)) {
	static get is() { return 'd2l-mastery-view-table'; }

	static get properties() {
		return {
			_learnerList: Array,

			_outcomeHeadersData: Array,
			_learnerRowsData: Array,

			_firstRowIdx: Number,
			_lastRowIdx: Number,
			_nameFirstLastFormat: Boolean,
			_sortDesc: Boolean
		};
	}

	static get styles() {
		return [
			css`
				.learner-column-head {
					padding: 0px 16px;
					width: 166px;
				}

				.learner-name-label {
					padding: 0px 16px;
				}

				.learner-name-label:focus {
					outline: 0;
					text-decoration: underline;
				}
								
			`,
			d2lTableStyles,
			linkStyles
		];
	}

	constructor() {
		super();
		this._outcomeHeadersData = [];
		this._learnerRowsData = [];
		this._learnerList = [];
		this._firstRowIdx = 0;
		this._lastRowIdx = 19;
		this._nameFirstLastFormat = false;
		this._sortDesc = false;
		this._setEntityType(ClassOverallAchievementEntity);
	}

	render() {
		if (this._outcomeHeadersData.Length === 0) {
			return null;
		}

		return html`
		<d2l-table-wrapper sticky-headers show-actions type="default">
			<table class="d2l-table">
				<thead>
					${this._renderTableHead(this._overallOutcomesData)}
				</thead>
				<tbody>
					${this._renderTableBody(this._learnerRowsData)}
				<tbody>
			</table>
		</d2l-table-wrapper>
		`;
	}
	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
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

	_getLearnerRowsData(learnerInfoList, firstRowIdx, lastRowIdx) {
		return learnerInfoList.slice(firstRowIdx, lastRowIdx);
	}

	_getUserNameDisplay(firstName, lastName, firstLastFormat) {
		if (firstLastFormat) {
			return firstName + ' ' + lastName;
		}
		else {
			return lastName + ', ' + firstName;
		}
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
				let firstName, lastName;
				const userOutcomeDataLinks = [];

				Promise.all([
					new Promise((resolve) => {
						coaUser.onUserChanged(user => {
							if (!user) {
								return;
							}
							firstName = user.getFirstName();
							lastName = user.getLastName();
							resolve();
						});
					}),
					new Promise((resolve) => {
						coaUser.onUserProgressOutcomesChanged(upoc => {
							if (!upoc) {
								return;
							}
							const upoEntities = upoc.getUserProgressOutcomes();
							upoEntities.map(upo => {
								const userOutcomeData = {
									outcomeHref: upo.getOutcomeHref(),
									activityCollectionHref: upo.getOutcomeActivitiesHref()
								};
								userOutcomeDataLinks.push(userOutcomeData);
							});
							userOutcomeDataLinks.sort((left, right) => {
								return left.outcomeHref.localeCompare(right.outcomeHref);
							});
							resolve();
						});
					})
				]).then(() => {
					const gradesPageLink = coaUser.getUserGradesSummaryHref();
					const learnerInfo = {
						firstName: firstName,
						lastName: lastName,
						outcomesProgressData: userOutcomeDataLinks,
						gradesPageHref: gradesPageLink
					};
					learnerInfoList.push(learnerInfo);
				});
			});

			classlist.subEntitiesLoaded().then(() => {
				this._learnerList = this._sortLearners(learnerInfoList, !this._nameFirstLastFormat, this._sortDesc);
				this._learnerRowsData = this._getLearnerRowsData(this._learnerList, this._firstRowIdx, this._lastRowIdx);
			});
		});

		entity.subEntitiesLoaded().then(() => {
			outcomeHeadersData.sort((left, right) => {
				return left.href.localeCompare(right.href);
			});
			this._outcomeHeadersData = outcomeHeadersData;
		});
	}

	//Switch the user sort order between ascending/descending
	_onFirstLearnerHeaderButtonClicked() {
		this._sortDesc = !this._sortDesc;
		this._updateSortOrder();
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
			>
				${nameLabels.first}
			</d2l-table-col-sort-button>
			${nameLabels.divider}
			<d2l-table-col-sort-button
				nosort
				@click="${this._onSecondLearnerHeaderButtonClicked}}"
			>
				${nameLabels.second}</d2l-table-col-sort-button>
		</div></th>
		`;
	}

	_renderLearnerRow(learnerData) {
		if (!learnerData) {
			//Should this ever happen? This means we have data for a user but no data is present.
			return null;
		}
		//Need to add learner outcome cells
		return html`
		<tr>
			<td sticky>
				<a
					href="${learnerData.gradesPageHref}"
					class="d2l-link learner-name-label"
				>
					${this._getUserNameDisplay(learnerData.firstName, learnerData.lastName, this._nameFirstLastFormat)}
				</a>
			</td>
			${learnerData.outcomesProgressData.map(outcomeData => { return html`
				<td>
					<d2l-mastery-view-user-outcome-cell
						href="${outcomeData.activityCollectionHref}"
						token="${this.token}"
					/>
				</td>
				`; })}
		</tr>
		`;
	}
	_renderOutcomeColumnHead(outcomeData) {
		if (!outcomeData) {
			//Should this ever happen?
			return null;
		}
		return html`
		<th>
			<d2l-mastery-view-outcome-header-cell
				href="${outcomeData.activityCollectionHref}"
				token="${this.token}"
				outcome-name="${outcomeData.name}"
				outcome-description="${outcomeData.description}"
				display-unassessed
			/>
		</th>`;

	}

	_renderTableBody(rowsData) {
		if (rowsData.length === 0) {
			//Show table loading state
			return null;
		}
		else {
			return rowsData.map(item => this._renderLearnerRow(item));
		}
	}
	_renderTableHead() {
		return html`
		<tr header>
			${this._renderLearnerColumnHead(this._nameFirstLastFormat)}
			${this._outcomeHeadersData.map(item => this._renderOutcomeColumnHead(item))}
		</tr>
		`;
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

	_updateSortOrder() {
		this._learnerList = this._sortLearners(this._learnerList, !this._nameFirstLastFormat, this._sortDesc);
		this._learnerRowsData = this._getLearnerRowsData(this._learnerList, this._firstRowIdx, this._lastRowIdx);
	}

}

customElements.define(MasteryViewTable.is, MasteryViewTable);
