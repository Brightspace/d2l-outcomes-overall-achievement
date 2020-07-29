import { LitElement, html, css } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { heading3Styles } from '@brightspace-ui/core/components/typography/styles';
import '../outcome-text-display/outcome-text-display';
import '../overall-achievement-tile/overall-achievement-tile';
import '../assessment-summary/assessment-summary';
import 'd2l-outcomes-user-progress/src/evidence/evidence-list';
import { UserProgressOutcomeEntity } from '../entities/UserProgressOutcomeEntity';

class PrimaryPanel extends EntityMixinLit(LocalizeMixin(LitElement)) {
	static get is() {
		return "d2l-coa-primary-panel";
	}

	static get properties() {
		return {
			_userProgressOutcomeHref: { attribute: false },
			_outcomeActivitiesHref: { attribute: false },
			_checkpointHref: { attribute: false },
		};
	}

	static get styles() {
		return [
			css`
				#evidence-list {
					margin-top: 12px;
				}

			`,
			heading3Styles
		];
	}

	constructor() {
		super();
		this._setEntityType(UserProgressOutcomeEntity);

		this._userProgressOutcome = '';
		this._outcomeActivitiesHref = '';
		this._checkpointHref = '';
	}

	render() {
		return html`
			<d2l-coa-outcome-text-display 
				href="${this._userProgressOutcomeHref}" 
				token="${this.token}">
			</d2l-coa-outcome-text-display>

			<div class="d2l-heading-3">Trend</div>
			<d2l-coa-overall-achievement-tile 
				href="${this._checkpointHref}" 
				token="${this.token}">
			</d2l-coa-overall-achievement-tile>

			<div class="d2l-heading-3">Evidence</div>
			<d2l-coa-assessment-summary 
				href="${this._outcomeActivitiesHref}" 
				token="${this.token}">
			</d2l-coa-assessment-summary>
			
			<d2l-evidence-list 
				href="/data/user-progress-outcome/upo0.json" 
				token="${this.token}">
			</d2l-evidence-list>
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
			let checkpointHref;
			this._userProgressOutcomeHref = entity._outcomeHref();
			this._outcomeActivitiesHref = entity._outcomeActivitiesHref();
			entity.onOutcomeActivitiesChanged(outcomeActivities => {
				outcomeActivities.onActivityChanged(activity => {
					if (activity.getActivityType() == "Checkpoint") {
						checkpointHref = activity.getSelfHref();
					}
				})
			})

			entity.subEntitiesLoaded().then(() => {
				this._checkpointHref = checkpointHref;
			})
		}
	}
}

customElements.define(PrimaryPanel.is, PrimaryPanel);