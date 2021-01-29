import { LitElement, html, css } from 'lit-element';
import { labelStyles } from '@brightspace-ui/core/components/typography/styles';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { OutcomeActivityCollectionEntity } from '../entities/OutcomeActivityCollectionEntity';
import '../stacked-bar/stacked-bar';
import './assessment-summary-skeleton.js';

const excludedActivityTypes = [
	'checkpoint-item'
];

class AssessmentSummary extends SkeletonMixin(EntityMixinLit(LocalizeMixin(LitElement))) {
	static get is() { return 'd2l-coa-assessment-summary'; }

	static get properties() {
		return {
			_totalCount: { attribute: false }
		};
	}

	static get styles() {
		return [
			css`
				label {
					display: block;
					margin-bottom: 0.6rem;
				}

				.d2l-skeletize {
					display: block;
					width: 6.7rem;
					height: 1rem;
					margin-bottom: 0.6rem;
					color: red;
				}
			`,
			labelStyles,
			super.styles
		];
	}

	constructor() {
		super();
		this._setEntityType(OutcomeActivityCollectionEntity);

		this._totalCount = 0;
		this.skeleton = true;
	}

	render() {
		if (this.skeleton) {
			return html`
				<d2l-coa-assessment-summary-skeleton>
				</d2l-coa-assessment-summary-skeleton>
			`;
		}
		const assessmentCountLabel = html`
			<label for="chart" class="d2l-label-text">${this.localize('headingTotalAssessments', { num: this._totalCount })}</label>
		`;
		return html`
			${assessmentCountLabel}
			<d2l-coa-stacked-bar
				id="chart"
				href="${this.href}"
				.token="${this.token}"
				excluded-types=${JSON.stringify(excludedActivityTypes)}
				?skeleton=${this.skeleton}
			></d2l-coa-stacked-bar>
        `;
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}
	//
	_onEntityChanged(entity) {
		if (entity) {
			const demonstrations = [];
			entity.onActivityChanged(activity => {
				const activityType = activity.getType();
				if (activityType && excludedActivityTypes.includes(activityType)) {
					return;
				}

				activity.onAssessedDemonstrationChanged(demonstration => {
					const demonstratedLevel = demonstration.getDemonstratedLevel();
					demonstrations.push(demonstratedLevel.getLevelId());
				});
			});

			entity.subEntitiesLoaded().then(() => {
				this._totalCount = demonstrations.length;
				this.skeleton = false;
			});
		}
	}
}

customElements.define(AssessmentSummary.is, AssessmentSummary);
