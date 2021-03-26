import '@brightspace-ui/core/components/colors/colors';
import '@brightspace-ui/core/components/typography/typography';
import './assessment-entry';
import './assessment-skeleton';
import { css, html, LitElement } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { UserProgressOutcomeEntity } from '../entities/UserProgressOutcomeEntity';

const excludedActivityTypes = [
	'checkpoint-item'
];

export class AssessmentList extends SkeletonMixin(EntityMixinLit(LocalizeMixin(LitElement))) {

	static get properties() {
		return {
			_assessmentList: { attribute: false }
		};
	}

	static get styles() {
		return [
			css`
				.no-evidence {
					border: 1px solid var(--d2l-color-gypsum);
					border-radius: 8px;
					background-color: var(--d2l-color-regolith);
					color: var(--d2l-color-ferrite);
					padding: 15px;
					box-sizing: border-box;
					width: 100%;
				}
			`,
			super.styles
		];
	}

	constructor() {
		super();
		this._setEntityType(UserProgressOutcomeEntity);

		this._assessmentList = [];
		this.skeleton = true;
	}

	static get is() { return 'd2l-coa-assessment-list'; }

	render() {
		if (this.skeleton) {
			return html`
				<d2l-coa-assessment-skeleton
					href="${this.href}"
					.token="${this.token}"
				></d2l-coa-assessment-skeleton>
				<d2l-coa-assessment-skeleton
					href="${this.href}"
					.token="${this.token}"
				></d2l-coa-assessment-skeleton>
				<d2l-coa-assessment-skeleton
					href="${this.href}"
					.token="${this.token}"
				></d2l-coa-assessment-skeleton>
			`;
		}

		return html`
			<div>
				${this._assessmentList.map(this._renderAssessmentEntry, this)}
			</div>
		`;
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	_onEntityChanged(entity) {
		if (entity) {
			const assessmentList = [];
			entity.onOutcomeActivitiesChanged(activities => {
				activities.onActivityChanged(activity => {
					const activityType = activity.getType();
					if (activityType && !excludedActivityTypes.includes(activityType)) {
						const activityObject = activity;
						activity.onAssessedDemonstrationChanged(demonstration => {
							const assessmentEntry = {
								date: new Date(demonstration.getDateAssessed()),
								activity: activityObject,
								demonstrationHref: demonstration.getSelfHref()
							};
							assessmentList.push(assessmentEntry);
						});
					}
				});
			});

			entity.subEntitiesLoaded().then(() => {
				this._assessmentList = assessmentList.sort((a, b) => b.date - a.date);
				this.skeleton = false;
			});
		}
	}

	_renderAssessmentEntry(entry) {
		if (!entry) {
			return html`
				<d2l-coa-assessment-skeleton
					href="${this.href}"
					.token="${this.token}"
				></d2l-coa-assessment-skeleton>
			`;
		}

		return html`
			<d2l-coa-assessment-entry
				href="${entry.demonstrationHref}"
				.activity="${entry.activity}"
				.token="${this.token}">
			</d2l-coa-assessment-entry>
		`;
	}

}

customElements.define(AssessmentList.is, AssessmentList);
