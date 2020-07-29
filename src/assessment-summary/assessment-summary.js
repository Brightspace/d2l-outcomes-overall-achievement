import { LitElement, html, css } from 'lit-element';
import { labelStyles } from '@brightspace-ui/core/components/typography/styles';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { OutcomeActivityCollectionEntity } from '../entities/OutcomeActivityCollectionEntity';
import '../stacked-bar/stacked-bar';

const excludedActivityTypes = [
	'Checkpoint'
];

class AssessmentSummary extends EntityMixinLit(LocalizeMixin(LitElement)) {
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
					margin-bottom: 12px;
				}
			`,
			labelStyles
		];
	}

	constructor() {
		super();
		this._setEntityType(OutcomeActivityCollectionEntity);

		this._totalCount = 0;
	}

	render() {
		return html`
			<label for="chart" class="d2l-label-text">${this.localize('headingTotalAssessments', { num: this._totalCount })}</label>
			<d2l-coa-stacked-bar
				id="chart"
				href="${this.href}"
				token="${this.token}"
				excluded-types=${JSON.stringify(excludedActivityTypes)}
			></d2l-coa-stacked-bar>
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
			});
		}
	}
}

customElements.define(AssessmentSummary.is, AssessmentSummary);
