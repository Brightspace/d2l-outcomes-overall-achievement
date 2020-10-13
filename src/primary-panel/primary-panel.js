import { LitElement, html, css } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { heading3Styles } from '@brightspace-ui/core/components/typography/styles';
import '../outcome-text-display/outcome-text-display';
import '../overall-achievement-tile/overall-achievement-tile';
import '../assessment-summary/assessment-summary';
import '../assessment-list/assessment-list';
import '../trend/big-trend';
import { UserProgressOutcomeEntity } from '../entities/UserProgressOutcomeEntity';

class PrimaryPanel extends EntityMixinLit(LocalizeMixin(LitElement)) {
	static get is() {
		return 'd2l-coa-primary-panel';
	}

	static get properties() {
		return {
			_outcomeHref: { attribute: false },
			_outcomeActivitiesHref: { attribute: false },
			_checkpointHref: { attribute: false },
		};
	}

	static get styles() {
		return [
			css`
				#list-spacer {
					height: 18px;
				}

				#trend-spacer {
					height: 30px;
				}
			`,
			heading3Styles
		];
	}

	constructor() {
		super();
		this._setEntityType(UserProgressOutcomeEntity);

		this._outcomeHref = '';
		this._outcomeActivitiesHref = '';
		this._checkpointHref = '';
	}

	render() {
		return html`
			<d2l-coa-outcome-text-display 
				href="${this._outcomeHref}" 
				token="${this.token}">
			</d2l-coa-outcome-text-display>

			<div class="d2l-heading-3">${this.localize('trend')}</div>

			<d2l-coa-big-trend
				href="${this._outcomeActivitiesHref}"
				token="${this.token}">
			</d2l-coa-big-trend>

			<div id="trend-spacer"></div>

			<d2l-coa-overall-achievement-tile 
				href="${this._checkpointHref}" 
				token="${this.token}">
			</d2l-coa-overall-achievement-tile>

			<div class="d2l-heading-3">${this.localize('evidence')}</div>
			<d2l-coa-assessment-summary
				href="${this._outcomeActivitiesHref}" 
				token="${this.token}">
			</d2l-coa-assessment-summary>
			
			<div id="list-spacer"></div>

			<d2l-coa-assessment-list
				href="${this.href}"
				token="${this.token}">
			</d2l-coa-assessment-list>
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
			const outcomeHref = entity.getOutcomeHref();
			const outcomeActivitiesHref = entity.getOutcomeActivitiesHref();
			entity.onOutcomeActivitiesChanged(outcomeActivities => {
				outcomeActivities.onActivityChanged(activity => {
					if (activity.getType() === 'checkpoint-item') {
						checkpointHref = activity.getSelfHref();
					}
				});
			});

			entity.subEntitiesLoaded().then(() => {
				this._outcomeHref = outcomeHref;
				this._outcomeActivitiesHref = outcomeActivitiesHref;
				this._checkpointHref = checkpointHref;
			});
		}
	}
}

customElements.define(PrimaryPanel.is, PrimaryPanel);
