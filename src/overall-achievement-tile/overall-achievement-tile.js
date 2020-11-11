import { LitElement, html, css } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { heading4Styles, bodySmallStyles } from '@brightspace-ui/core/components/typography/styles';
import { formatDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { OutcomeActivityEntity } from '../entities/OutcomeActivityEntity';
import '@brightspace-ui/core/components/colors/colors';
import '@brightspace-ui/core/components/icons/icon';
import '@brightspace-ui/core/components/icons/icon-custom';
import '@brightspace-ui/core/components/more-less/more-less';
import '@brightspace-ui/core/components/typography/typography';
import '../diamond/diamond';
import '../custom-icons/quote';
import '../custom-icons/visibility-hide';
import '../custom-icons/visibility-show';

class OverallAchievementTile extends EntityMixinLit(LocalizeMixin(LitElement)) {
	static get is() {
		return 'd2l-coa-overall-achievement-tile';
	}

	static get properties() {
		return {
			_activityName: { attribute: false },
			_feedback: { attribute: false },
			_levelColor: { attribute: false },
			_levelName: { attribute: false },
			_published: { attribute: false }
		};
	}

	static get styles() {
		return [
			css`
				#activity-name {
					margin: 0;
					display: inline-block;
				}

				#card {
					width: 100%;
					display: flex;
					flex-direction: column;
					border: 1px solid var(--d2l-color-gypsum);
					border-radius: 4px;
					box-sizing: border-box;
					padding: 18px 24px 24px;
					color: var(--d2l-color-ferrite);
					background-color: var(--d2l-color-white);
				}

				#card-header {
					align-items: flex-start;
					display: flex;
					margin-bottom: 12px;
				}

				#card-info {
					display: flex;
					flex-direction: column;
					margin: 0px 12px;
				}

				#date {
					margin: 0px;
					margin-top: 12px;
				}

				.feedback {
					font-size: 16px;
					margin: 0px 12px;
					color: var(--d2l-color-tungsten);
				}

				#feedback-container {
					display: flex;
				}

				#feedback-spacer {
					width: 36px;
				}
				
				.feedback-item {
					display: flex;
				}

				#header-left {
					display: flex;
					flex-grow: 1;
				}

				#loa {
					display: flex;
				}

				#loa-spacer {
					width: 12px;
				}

				#title {
					display: flex;
					align-items: center;
				}

				#visibility-icon {
					margin: 0px 12px;
				}

				@media (max-width: 768px) {
					#card {
						padding-left: 12px;
						padding-right: 12px;
					}

					#card-header {
						flex-direction: column;
					}

					#loa {
						margin-top: 12px;
					}

					#loa-icon {
						order: -2;
					}

					#loa-spacer {
						order: -1;
					}
				}
			`,
			heading4Styles,
			bodySmallStyles
		];
	}

	constructor() {
		super();
		this._setEntityType(OutcomeActivityEntity);

		this._accessDate = '';
		this._activityName = '';
		this._levelColor = '';
		this._levelName = '';
		this.refreshEntity = this._refreshEntity.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('d2l-save-evaluation', this.refreshEntity);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('d2l-save-evaluation', this.refreshEntity);
	}

	render() {
		const dateElement = this._accessDate && html`
			<div id="date" class="d2l-body-small">${formatDate(this._accessDate, {format: 'short'})}</div>
		`;

		return html`
			<div id="card">
				<div id="card-header">
					<div id="header-left">
						<d2l-icon icon="tier2:grade"></d2l-icon> 
						<div id="card-info">
							<div id="title">
								<h4 class="d2l-heading-4" id="activity-name">${this._activityName}</h4>
								<div>${this._renderVisibilityIcon(this._published)}</div> 
							</div>
							${dateElement}
						</div>
					</div>
					<div id="loa">
						<div id="level-name">${this._levelName}</div>
						<div id="loa-spacer"></div>
						<d2l-coa-diamond id="loa-icon" color="${this._levelColor}" edge-width="18"></d2l-coa-diamond>
					</div>
				</div>
				<div id="feedback-container">
					<div id="feedback-spacer"></div>
					${this._feedback && this._feedback.map(this._renderFeedback.bind(this))}
				</div>
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
			let levelName, levelColor, accessDate, feedback, published;
			entity.onAssessedDemonstrationChanged(demonstration => {
				if(!demonstration) {
					return;
				}
				demonstration.onFeedbackChanged(feedbackList => {
					feedback = feedbackList.getFeedback();
				});
				const demonstratedLevel = demonstration.getDemonstratedLevel();
				if(!demonstratedLevel) {
					return;
				}
				demonstratedLevel.onLevelChanged(level => {
					levelName = level.getName();
					levelColor = level.getColor();
				});
				published = demonstration.isPublished();
				accessDate = demonstration.getDateAssessed();
			});
			const activityName = entity.getName();

			entity.subEntitiesLoaded().then(() => {
				this._accessDate = new Date(accessDate);
				this._activityName = activityName;
				this._feedback = feedback;
				this._levelColor = levelColor;
				this._levelName = levelName;
				this._published = published;
			});
		}
	}

	_refreshEntity() {
		window.D2L.Siren.EntityStore.fetch(this.href, this.token, true);
	}

	_renderFeedback(feedbackData) {
		if (!feedbackData) {
			return null;
		}

		const feedback = feedbackData.getText() || unsafeHTML(feedbackData.getHtml()); // TODO: Is there a safe way to do HTML?

		return html`
			<div class="feedback-item">
				<d2l-icon-quote></d2l-icon-quote>
				<div class="feedback">${feedback}</div>
			</div>
		`;
	}

	_renderVisibilityIcon(isPublished) {
		if (isPublished) {
			return html`
				<d2l-icon-visibility-show id="visibility-icon"></d2l-icon-visibility-show>
			`;
		}

		return html`
			<d2l-icon-visibility-hide id="visibility-icon"></d2l-icon-visibility-hide>
		`;
	}
}

customElements.define(OverallAchievementTile.is, OverallAchievementTile);
