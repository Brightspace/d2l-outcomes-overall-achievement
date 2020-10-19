import { LitElement, html, css } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { heading3Styles } from '@brightspace-ui/core/components/typography/styles';
import '@brightspace-ui/core/components/button/button-icon';
import '../outcome-text-display/outcome-text-display';
import '../overall-achievement-tile/overall-achievement-tile';
import '../assessment-summary/assessment-summary';
import '../assessment-list/assessment-list';
import '../trend/big-trend';
import { UserProgressOutcomeEntity } from '../entities/UserProgressOutcomeEntity';
import { Consts } from '../consts';

class PrimaryPanel extends EntityMixinLit(LocalizeMixin(LitElement)) {
	static get is() {
		return 'd2l-coa-primary-panel';
	}

	static get properties() {
		return {
			instructor: { type: Boolean },
			outcomeTerm: { attribute: 'outcome-term', type: String },
			showClose: { attribute: 'show-close', type: Boolean },
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

				#header {
					display: flex;
				}

				#header d2l-coa-outcome-text-display {
					flex-grow: 1;
				}

				.close-button {
					display: block;
					flex-grow: 0;
					margin-left: 16px;
				}
			`,
			heading3Styles
		];
	}

	constructor() {
		super();
		this._setEntityType(UserProgressOutcomeEntity);

		this.instructor = false;
		this.showClose = false;
		this._outcomeHref = '';
		this._outcomeActivitiesHref = '';
		this._checkpointHref = '';
	}

	render() {
		const closeButton = this.showClose
			? html`<d2l-button-icon class="close-button" icon="d2l-tier1:close-large-thick" text="${this.localize('close')}" @click=${this._close}></d2l-button-icon>`
			: null;

		return html`
			<div id="header">
				<d2l-coa-outcome-text-display 
					href="${this._outcomeHref}" 
					token="${this.token}">
				</d2l-coa-outcome-text-display>
				${closeButton}
			</div>

			<div class="d2l-heading-3">${this.localize('trend')}</div>

			<d2l-coa-big-trend
				href="${this._outcomeActivitiesHref}"
				token="${this.token}"
				instructor="${this.instructor}"
				outcome-term="${this.outcomeTerm}"
			></d2l-coa-big-trend>

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

	_close() {
		this.dispatchEvent(new CustomEvent(
			Consts.events.primaryPanelCloseClicked,
			{ bubbles: true, composed: true }
		));
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
