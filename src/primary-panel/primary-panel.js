import { LitElement, html, css } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { heading3Styles } from '@brightspace-ui/core/components/typography/styles';
import '@brightspace-ui/core/components/button/button-icon';
import '../outcome-text-display/outcome-text-display';
import '../overall-achievement-tile/overall-achievement-tile';
import '../assessment-summary/assessment-summary';
import '../assessment-list/assessment-list';
import '../trend/big-trend';
import { UserProgressOutcomeEntity } from '../entities/UserProgressOutcomeEntity';
import { Consts } from '../consts';

class PrimaryPanel extends EntityMixinLit(SkeletonMixin(LocalizeMixin(LitElement))) {
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

				
				.outcome-text-line1-skeleton {
					display: block;
					width: 100%;
					height: 1.1rem;
					margin-bottom: 0.5rem;
				}

				.outcome-text-line2-skeleton {
					display: block;
					width: 85%;
					height: 1.1rem;
					margin-bottom: 1.2rem;
				}

				.outcome-notation-skeleton {
					display: block;
					width: 6rem;
					height: 0.8rem;
					margin-bottom: 1.8rem;
				}

				.trend-title-skeleton {
					display: block;
					width: 6rem;
					height: 1.1rem;
					margin-bottom: 1.8rem;
				}

				.trend-graph-skeleton {
					display: block;
					width: 100%;
					height: 6.3rem;
					margin-bottom: 2.4rem;
				}

				.overall-achievement-tile-skeleton {
					display: block;
					width: 100%;
					height: 5.1rem;
					margin-bottom: 1.8rem;
				}

				.evidence-title-skeleton {
					display: block;
					width: 6rem;
					height: 1.1rem;
					margin-bottom: 1.8rem;
				}

				.assessment-skeleton-container {
					display: flex;
				}

				.assessment-date-skeleton {
					display: inline-block;
					width: 1.5rem;
					height: 1.5rem;
					margin-left: 0.6rem;
				}

				.assessment-tile-skeleton {
					display: inline-block;
					flex-grow: 1;
					height: 5.1rem;
					margin-left: 0.6rem;
					margin-bottom: 0.9rem;
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
		this._outcomeHref = '';
		this._outcomeActivitiesHref = '';
		this._checkpointHref = '';
		this._checkpointPublished = false;
		this.skeleton = true;
	}

	render() {

		if(this.skeleton) {
			return this._renderPanelSkeleton();
		}

		const closeButton = this.showClose ? html`
			<d2l-button-icon
				class="close-button"
				icon="d2l-tier1:close-large-thick"
				text="${this.localize('close')}"
				@click=${this._close}
			></d2l-button-icon>
		` : null;

		const coaTile = (this.hideUnpublishedCoa && !this._checkpointPublished) ? null : this._checkpointHref && html`
		<d2l-coa-overall-achievement-tile 
			href="${this._checkpointHref}" 
			.token="${this.token}">
		</d2l-coa-overall-achievement-tile>
		`;

		return html`
			<div id="header">
				<d2l-coa-outcome-text-display 
					href="${this._outcomeHref}" 
					.token="${this.token}"
					?skeleton=${this.skeleton}
				/>
				${closeButton}
			</div>

			<h3 class="d2l-heading-3">${this.localize('trend')}</h3>

			<d2l-coa-big-trend
				href="${this._outcomeActivitiesHref}"
				.token="${this.token}"
				instructor="${this.instructor}"
				outcome-term="${this.outcomeTerm}"
				?hide-unpublished-coa="${this.hideUnpublishedCoa}"
			></d2l-coa-big-trend>

			<div id="trend-spacer"></div>

			${coaTile}

			<h3 class="d2l-heading-3">${this.localize('evidence')}</h3>
			<d2l-coa-assessment-summary
				href="${this._outcomeActivitiesHref}" 
				.token="${this.token}">
			</d2l-coa-assessment-summary>
			
			<div id="list-spacer"></div>

			<d2l-coa-assessment-list
				href="${this.href}"
				.token="${this.token}"
			/>
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

	_renderAssessmentPlaceholderSkeleton() {
		return html`
			<div class="assessment-skeleton-container">
				<span class="assessment-date-skeleton d2l-skeletize"></span>
				<span class="assessment-tile-skeleton d2l-skeletize"></span>
			</div>
		`
	}

	_renderPanelSkeleton() {
		console.log("Skeleton!");
		return html`
			<div class="outcome-text-line1-skeleton d2l-skeletize"></div>
			<div class="outcome-text-line2-skeleton d2l-skeletize"></div>
			<div class="outcome-notation-skeleton d2l-skeletize"></div>
			<div class="trend-title-skeleton d2l-skeletize"></div>
			<div class="trend-graph-skeleton d2l-skeletize"></div>
			<div class="overall-achievement-tile-skeleton d2l-skeletize"></div>
			<div class="evidence-title-skeleton d2l-skeletize"></div>
			${this._renderAssessmentPlaceholderSkeleton()}
			${this._renderAssessmentPlaceholderSkeleton()}
			${this._renderAssessmentPlaceholderSkeleton()}
		`;
	}
}

customElements.define(PrimaryPanel.is, PrimaryPanel);
