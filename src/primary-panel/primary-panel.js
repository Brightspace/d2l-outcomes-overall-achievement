import { LitElement, html, css } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { heading3Styles } from '@brightspace-ui/core/components/typography/styles';
import '@brightspace-ui/core/components/button/button-icon';
import '../outcome-text-display/outcome-text-display';
import '../outcome-text-display/outcome-text-skeleton';
import '../overall-achievement-tile/overall-achievement-tile';
import '../assessment-summary/assessment-summary';
import '../assessment-list/assessment-list';
import '../trend/big-trend';
import { UserProgressOutcomeEntity } from '../entities/UserProgressOutcomeEntity';
import { Consts } from '../consts';

class PrimaryPanel extends SkeletonMixin(EntityMixinLit(LocalizeMixin(LitElement))) {
	static get is() {
		return 'd2l-coa-primary-panel';
	}

	static get properties() {
		return {
			instructor: { type: Boolean },
			outcomeTerm: { attribute: 'outcome-term', type: String },
			hideUnpublishedCoa: { attribute: 'hide-unpublished-coa', type: Boolean },
			showClose: { attribute: 'show-close', type: Boolean },
			_outcomeHref: { attribute: false },
			_outcomeActivitiesHref: { attribute: false },
			_checkpointHref: { attribute: false },
			_checkpointPublished: { attribute: false }
		};
	}

	static get styles() {
		return [
			css`
				#big-trend-skeleton {
					height: 126px;
				}

				#tile-skeleton {
					height: 118px;
				}

				#trend-title-skeleton {
					width: 100px;
				}

				#evidence-title-skeleton {
					width: 100px;
				}

				#tile-skeleton {
					height: 102px;
				}

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

				.d2l-body-compact {
					font-size: 17px;
				}

				:host([skeleton][dir="rtl"]) .d2l-skeletize-paragraph-2 {
					-webkit-transform: scale(-1, 1);
					transform: scale(-1, 1);
					transform-origin: center;
				}
			`,
			heading3Styles,
			super.styles
		];
	}

	constructor() {
		super();
		this._setEntityType(UserProgressOutcomeEntity);

		this.hideUnpublishedCoa = false;
		this.instructor = false;
		this.showClose = false;
		this.skeleton = true;
		this._outcomeHref = '';
		this._outcomeActivitiesHref = '';
		this._checkpointHref = '';
		this._checkpointPublished = false;
		this.skeleton = true;
	}

	render() {

		const closeButton = this.showClose ? html`
			<d2l-button-icon
				class="close-button"
				icon="d2l-tier1:close-large-thick"
				text="${this.localize('close')}"
				@click=${this._close}
			></d2l-button-icon>
		` : null;

		const coaTile = (this.hideUnpublishedCoa && !this._checkpointPublished) ? null : (this.skeleton) ? html`
			<div id="tile-skeleton" class="d2l-skeletize"></div>
		` : html`
			<d2l-coa-overall-achievement-tile 
				href="${this._checkpointHref}" 
				.token="${this.token}"
			></d2l-coa-overall-achievement-tile>
		`;

		const coaOutcomeText = this.skeleton ? html `
			<d2l-coa-outcome-text-skeleton>
			</d2l-coa-outcome-text-skeleton>
		` : html `
			<div id="header">
				<d2l-coa-outcome-text-display
					href="${this._outcomeHref}"
					.token="${this.token}">
				</d2l-coa-outcome-text-display>
				${closeButton}
			</div>
		`;

		const coaTrendTitle = this.skeleton ? html `
			<div id="trend-title-skeleton" class="d2l-heading-3 d2l-skeletize"></div>
		` : html`
			<h3 class="d2l-heading-3">${this.localize('trend')}</h3>
		`;

		const coaBigTrend = this.skeleton ? html `
			<div id="big-trend-skeleton" class="d2l-skeletize"></div>
		` : html `
			<d2l-coa-big-trend
				href="${this._outcomeActivitiesHref}"
				.token="${this.token}"
				instructor="${this.instructor}"
				outcome-term="${this.outcomeTerm}"
				?hide-unpublished-coa="${this.hideUnpublishedCoa}"
			></d2l-coa-big-trend>
		`;

		const coaEvidenceTitle = this.skeleton ? html `
			<div id="evidence-title-skeleton" class="d2l-heading-3 d2l-skeletize"></div>
		` : html`
			<h3 class="d2l-heading-3">${this.localize('evidence')}</h3>
		`;
		return html`

			${coaOutcomeText}

			${coaTrendTitle}

			${coaBigTrend}

			<div id="trend-spacer"></div>

			${coaTile}

			${coaEvidenceTitle}

			<d2l-coa-assessment-summary
				href="${this._outcomeActivitiesHref}" 
				.token="${this.token}">
			</d2l-coa-assessment-summary>
			
			<div id="list-spacer"></div>

			<d2l-coa-assessment-list
				href="${this.href}"
				.token="${this.token}"
				?skeleton="${this.skeleton}">
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
			let checkpointPublished;
			const outcomeHref = entity.getOutcomeHref();
			const outcomeActivitiesHref = entity.getOutcomeActivitiesHref();

			

			entity.onOutcomeActivitiesChanged(outcomeActivities => {
				if (!outcomeActivities) {
					return;
				}
				outcomeActivities.onActivityChanged(activity => {
					if (!activity) {
						return;
					}
					if (activity.getType() === 'checkpoint-item') {
						checkpointHref = activity.getSelfHref();
						activity.onAssessedDemonstrationChanged(demonstration => {
							checkpointPublished = demonstration.isPublished();
						});
					}
				});
			});
			
			entity.subEntitiesLoaded().then(() => {
				this._outcomeHref = outcomeHref;
				this._outcomeActivitiesHref = outcomeActivitiesHref;
				this._checkpointHref = checkpointHref;
				this._checkpointPublished = checkpointPublished;
				this.skeleton = false;
			});
		}
	}
}

customElements.define(PrimaryPanel.is, PrimaryPanel);
