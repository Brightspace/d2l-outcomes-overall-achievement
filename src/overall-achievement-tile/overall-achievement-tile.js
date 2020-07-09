import { LitElement, html, css } from 'lit-element';
import { heading4Styles, bodySmallStyles} from '@brightspace-ui/core/components/typography/styles';
import { formatDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { OutcomeActivityEntity } from '../entities/OutcomeActivityEntity';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/icons/icon-custom.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/more-less/more-less.js';
import '@brightspace-ui/core/components/typography/typography.js';
import '../diamond/diamond.js';

class OverallAchievementTile extends EntityMixinLit(LocalizeMixin(LitElement)) {
	static get is() {
		return 'd2l-coa-overall-achievement-tile';
	}

	static get properties() {
		return {
			_activityName: {
				attribute: false
			},

			_feedback: {
				attribute: false
			},

			_levelName: {
				attribute: false
			},

			_levelColor: {
				attribute: false
			},

			_quoteImage: {
				attribute: false
			},

			_published: {
				attribute: false
			}
		};
	}

	static get styles() {
		return [
			css`
                #activity-name {
                    margin: 0;
                    margin-right: 12px;
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
                    margin-bottom: 12px;
                }

                #card-header {
                    align-items: flex-start;
                    display: flex;
                    margin-bottom: 12px;
                }

                #card-info {
                    display: flex;
                    flex-direction: column;
                    margin-left: 12px;
                }

                #date {
                    margin: 0px;
                    margin-top: 12px;
                }

                .feedback {
					display: flex;
					text-align: left;
                    font-size: 16px;
                    margin-left: 12px;
                    color: var(--d2l-color-tungsten);
                }

                #feedback-container {
                    margin-left: 36px;
                }
                
                .feedback-info {
                    display: flex;
                }

                #header-left {
                    display: flex;
                    flex-grow: 1;
                }

                #level-name {
                    margin-right: 12px;
                }

                #loa {
                    display: flex;
                
                }

                #title {
                    display: flex;
                    align-items: center;
                }

                @media (max-width: 768px) {
                    #card {
                        padding-left: 12px;
                        padding-right: 12px;
                    }

                    #card-header {
                        flex-direction: column;
                    }

                    #demo-icon {
                        order: -1;
                        margin-right: 12px;
                    }

                    #loa {
                        margin-top: 12px;
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
		this._levelName = '';
		this._levelColor = '';
		this._quoteImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPg0KICA8ZGVmcz4NCiAgICA8cGF0aCBpZD0iYSIgZD0iTTAgMGgyNHYyNEgweiIvPg0KICA8L2RlZnM+DQogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xIC0xKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4NCiAgICA8bWFzayBpZD0iYiIgZmlsbD0iI2ZmZiI+DQogICAgICA8dXNlIHhsaW5rOmhyZWY9IiNhIi8+DQogICAgPC9tYXNrPg0KICAgIDxwYXRoIGQ9Ik02IDIyLjY2N0E0LjY2NyA0LjY2NyAwIDAgMCAxMC42NjcgMThjMC0xLjIyNy0uNTU5LTIuNS0xLjMzNC0zLjMzM0M4LjQ4MSAxMy43NSA3LjM1IDEzLjMzMyA2IDEzLjMzM2MtLjQxMSAwIDEuMzMzLTYuNjY2IDMtOSAxLjY2Ny0yLjMzMyAxLjMzMy0zIC4zMzMtM0M4IDEuMzMzIDUuMjUzIDQuNTg2IDQgNy4yNTUgMS43NzMgMTIgMS4zMzMgMTUuMzkyIDEuMzMzIDE4QTQuNjY3IDQuNjY3IDAgMCAwIDYgMjIuNjY3ek0xOCAyMi42NjdBNC42NjcgNC42NjcgMCAwIDAgMjIuNjY3IDE4YzAtMS4yMjctLjU1OS0yLjUtMS4zMzQtMy4zMzMtLjg1Mi0uOTE3LTEuOTgzLTEuMzM0LTMuMzMzLTEuMzM0LS40MTEgMCAxLjMzMy02LjY2NiAzLTkgMS42NjctMi4zMzMgMS4zMzMtMyAuMzMzLTMtMS4zMzMgMC00LjA4IDMuMjUzLTUuMzMzIDUuOTIyQzEzLjc3MyAxMiAxMy4zMzMgMTUuMzkyIDEzLjMzMyAxOEE0LjY2NyA0LjY2NyAwIDAgMCAxOCAyMi42Njd6IiBmaWxsPSIjRDNEOUUzIiBtYXNrPSJ1cmwoI2IpIi8+DQogIDwvZz4NCjwvc3ZnPg==';

	}

	render() {
		return html`
            <div id="card">
                <div id="card-header">
                    <div id="header-left">
                        <d2l-icon icon="tier2:grade"></d2l-icon> 
                        <div id="card-info">
                            <div id="title">
                                <h4 class="d2l-heading-4" id="activity-name">${this._activityName}</h4>
                                <div>${this._isPublished(this._published)}</div> 
                            </div>
                            <div id="date" class="d2l-body-small">${formatDate(this._accessDate, {format: 'short'})}</div>
                        </div>
                    </div>
                    <div id="loa">
                        <div id="level-name">${this._levelName}</div>
                        <d2l-coa-diamond id="demo-icon" color="${this._levelColor}" edge-width="18"></d2l-coa-diamond>
                    </div>
                </div>
                <div id="feedback-container">
                    ${this._feedback.map(this._renderFeedback.bind(this))}
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

	_isPublished(dataPublished) {
		if (dataPublished) {
			return html`
                <d2l-icon icon="tier1:visibility-show"></d2l-icon>
            `;
		}

		return html`
            <d2l-icon icon="tier1:visibility-hide"></d2l-icon>
        `;
	}
	_onEntityChanged(entity) {
		if (entity) {
			let levelName, levelColor, accessDate, feedback, published;
			entity.onAssessedDemonstrationChanged(demonstration => {
				demonstration.onFeedbackChanged(feedbackList => {
					feedback = feedbackList.getFeedback();
				});
				const demonstratedLevel = demonstration.getDemonstratedLevel();
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

	_renderFeedback(feedbackData) {
		if (!feedbackData) {
			return null;
		}

		return html`
            <div class="feedback-info">
                <img src="${this._quoteImage}" height="11" width="11"></img>
                <div class="feedback">${feedbackData.getText() || feedbackData.getHtml()}</div>
            </div>
        `;
	}

}

customElements.define(OverallAchievementTile.is, OverallAchievementTile);
