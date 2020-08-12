import { formatDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { LitElement, html, css } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { DemonstrationEntity } from '../entities/DemonstrationEntity';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { heading4Styles, bodySmallStyles } from '@brightspace-ui/core/components/typography/styles';
import '@brightspace-ui/core/components/typography/typography';
import '@brightspace-ui/core/components/typography/styles';
import '@brightspace-ui/core/components/icons/icon';
import '@brightspace-ui/core/components/colors/colors';
import '@brightspace-ui/core/components/more-less/more-less';
import '../custom-icons/quote';

export class AssessmentEntry extends EntityMixinLit(LocalizeMixin(LitElement)) {
	static get is() { return 'd2l-coa-assessment-entry'; }

	static get properties() {
		return {
			activity: { type: Object },
			_activityName: { attribute: false },
			_activityType: { attribute: false },
			_attempt: { attribute: false },
			_date: { attribute: false },
			_feedback: { attribute: false },
			_levelColor: { attribute: false },
			_levelName: { attribute: false },
			_link: { attribute: false }
		};
	}

	static get styles() {
		return [
			css`
				#activity-name {
					margin: 0;
					display: inline-block; 
					text-align: start;
				}

				#attempt {
					margin: 0px;
					margin-top: 12px;
					text-align: start;
				}

				button {
					font: inherit;
					-moz-appearance: none;
					-webkit-appearance: none;
					appearance: none;
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
					margin-bottom: 17px;
				}

				#card:not([disabled]):hover, #card:not([disabled]):focus {
					box-shadow: 0 4px 18px 2px rgba(0,0,0,0.06);
					top: -4px;
					transition: all 0.3s ease-out;
					transition-delay: 0.05s;
					cursor: pointer;
				}	

				#card-header {
					align-items: flex-start;
					display: flex;
					margin-bottom: 12px;
					width: 100%;
				}

				.date {
					margin-top: 6px;
				}

				.evidence {
					display: flex;
					align-items: stretch;
				}

				.feedback {
					display: flex;
					font-size: 16px;
				}

				.grow {
					flex-grow: 1;
					flex-shrink: 1;
				}

				#header-left {
					display: flex;
					flex-grow: 1;
					flex-direction: column;
					
				}

				.line {
					width: 1px;
					margin-top: 11px;
					background-color: var(--d2l-color-gypsum);
				}

				#loa {
					display: flex;
				}

				#loa-spacer {
					width: 12px;
				}

				:host([last]) .line {
					visibility: hidden;
				}

				#quote {
					margin: 0px 12px;
					text-align: start;
				}
				
				.timeline {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 60px;
					margin-top: 9px;
					flex-grow: 0;
					flex-shrink: 0;
				}

				#timeline-spacer {
					width: 12px;
				}

				@media (max-width: 768px) {
					#card {
						padding: 12px 18px;
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
			bodySmallStyles,
			heading4Styles
		];
	}

	constructor() {
		super();
		this._setEntityType(DemonstrationEntity);

		this.activity = this.activity || null;
		this._activityName = '';
		this._activityType = '';
		this._attempt = '';
		this._date = '';
		this._levelColor = '';
		this._levelName = '';
		this._link = '';
	}

	render() {
		return html `
			<div class="evidence">
				<div class="timeline">
					<d2l-icon icon="${this._getActivityIcon(this._activityType)}"></d2l-icon>
					<span class="date d2l-body-small">${formatDate(this._date, {format: 'MMM dd'})}</span>
					<div class="grow line"></div>
				</div>
				<div id="timeline-spacer"></div>
				<button id="card" class="d2l-more-less-toggle" ?disabled="${!this._link}" @click="${this._onClick}">
					<div id="card-header">
						<div id="header-left">
							<h4 class="d2l-heading-4" id="activity-name">${this._activityName}</h4>
							<div>${this._renderAttempt(this._attempt)}</div>
						</div>
						<div id="loa">
							<div>${this._levelName}</div>
							<div id="loa-spacer"></div>
							<svg height="24" width="24" id="loa-icon">
								<circle cx="12" cy="12" r="12" fill="${this._levelColor}"/>
							</svg>
						</div>
					</div>
					<div>
						<div id="feedback-spacer"></div>
						${this._feedback.map(this._renderFeedback, this)}
					</div>
				</button>
			</div>		
		`;
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	_getActivityIcon(toolName) {
		switch (toolName) {
			case 'Dropbox':
				return 'd2l-tier2:assignments';
			case 'Discussions':
				return 'd2l-tier2:discussions';
			case 'News':
				return 'd2l-tier2:news';
			case 'Locker':
				return 'd2l-tier2:locker';
			case 'Chat':
				return 'd2l-tier2:chat';
			case 'Links':
			case 'LTI':
				return 'd2l-tier2:link';
			case 'Surveys':
				return 'd2l-tier2:surveys';
			case 'Quizzing':
			case 'QuestionCollection':
				return 'd2l-tier2:quizzing';
			case 'Checklist':
				return 'd2l-tier2:checklist';
			case 'Grades':
				return 'd2l-tier2:grade';
			case 'SelfAssessments':
				return 'd2l-tier2:self-assessment';
			case 'Competencies':
				return 'd2l-tier2:user-competencies';
			case 'ePortfolio':
			case '703000': // Folio
				return 'd2l-tier2:eportfolio';
			default:
				return 'd2l-tier2:content';
		}
	}

	_onClick(event) {
		if (
			!this._link ||
			!event.composedPath() ||
			event.composedPath().some(element => {
				return (
					element instanceof HTMLElement &&
					element.tagName === 'D2L-BUTTON-SUBTLE' &&
					element.classList.contains('d2l-more-less-toggle')
				);
			})
		) {
			return;
		}
		window.location = this._link;
	}

	_onEntityChanged(entity) {
		if (entity) {
			let attempt, feedback, levelName, levelColor;
			const activityName = this.activity.getName();
			const activityType = this.activity.getType();
			const linkByActivity = this.activity.getSubmissionLinkHref();

			const linkByDem = entity.getSubmissionLinkHref();
			const date = entity.getDateAssessed();

			const demonstratedLevel = entity.getDemonstratedLevel();
			demonstratedLevel.onLevelChanged(level => {
				levelName = level.getName();
				levelColor = level.getColor();
			});

			entity.onUserActivityUsageChanged(activityUsage => {
				const userActivityName = activityUsage && activityUsage.getNameEntity();
				attempt = userActivityName ? userActivityName.getShortText() : null;
			});

			entity.onFeedbackChanged(feedbackList => {
				feedback = feedbackList.getFeedback();
			});

			entity.subEntitiesLoaded().then(() => {
				this._activityName = activityName;
				this._activityType = activityType;
				this._attempt = attempt;
				this._date = new Date(date);
				this._feedback = feedback;
				this._levelColor = levelColor;
				this._levelName = levelName;
				this._link = linkByDem || linkByActivity;
			});
		}
	}

	_renderAttempt(attempt) {
		if (!attempt) {
			return null;
		}

		return html`
			<div id="attempt" class="d2l-body-small">${attempt}</div>
		`;
	}

	_renderFeedback(feedbackData) {
		if (!feedbackData) {
			return null;
		}

		const feedback = feedbackData.getText() || unsafeHTML(feedbackData.getHtml());

		return html`
			<div class="feedback">
				<d2l-icon-quote></d2l-icon-quote>
				<d2l-more-less id="quote">${feedback}</d2l-more-less>
			</div>
		`;
	}

}

customElements.define(AssessmentEntry.is, AssessmentEntry);
