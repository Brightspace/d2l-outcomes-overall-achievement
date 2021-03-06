import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { OutcomeActivityCollectionEntity } from '../entities/OutcomeActivityCollectionEntity';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

export const TrendMixin = (superclass) => class extends SkeletonMixin(EntityMixinLit(superclass)) {

	static get properties() {
		return {
			hideUnpublishedCoa: { attribute: 'hide-unpublished-coa', type: Boolean },
			_trendData: { attribute: false }
		};
	}

	static get styles() {
		return [
			super.styles
		];
	}

	constructor() {
		super();
		this._setEntityType(OutcomeActivityCollectionEntity);

		this.hideUnpublishedCoa = false;
		this._trendData = null;
		this.skeleton = true;
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	_onEntityChanged(entity) {
		if (entity) {
			const activities = {};
			entity.onActivityChanged(activity => {
				const id = activity.getSelfHref();
				activities[id] = {
					attempts: [],
					dueDate: activity.getDueDate(),
					name: activity.getName(),
					type: activity.getType(),
					unpublishedCoa: false
				};

				activity.onAssessedDemonstrationChanged(demonstration => {
					if (!demonstration) {
						return;
					}

					if (activity.getType() === 'checkpoint-item' && !demonstration.isPublished()) {
						activities[id].unpublishedCoa = true;
					}
					const assessedDate = demonstration.getDateAssessed();
					const demonstratedLevel = demonstration.getDemonstratedLevel();
					if (!demonstratedLevel) {
						return;
					}
					const levelId = demonstratedLevel.getLevelId();

					const attempt = {
						date: assessedDate,
						index: demonstration.index,
						levelId: levelId
					};

					demonstration.onUserActivityUsageChanged(attemptActivity => {
						const attemptNameEntity = attemptActivity && attemptActivity.getNameEntity();
						const attemptName = attemptNameEntity ? attemptNameEntity.getShortText() : null;
						attempt.name = attemptName;
					});

					activities[id].attempts.push(attempt);
				});
			});

			const levels = {};
			entity.onDefaultScaleChanged(scale => {
				scale.onLevelChanged(level => levels[level.getLevelId()] = {
					name: level.getName(),
					color: level.getColor(),
					score: level.index + 1
				});
			});

			entity.subEntitiesLoaded().then(() => {
				const groups = this._parseTrendActivities(activities, levels);
				this._trendData = {
					levels,
					groups
				};
				this.skeleton = false;
			});
		}
	}

	_parseTrendActivities(activities, levels) {
		return Object.values(activities).reduce((acc, cur) => {
			cur.attempts = cur.attempts.filter(attempt => levels[attempt.levelId]) // Filter out attempts with levels from other scales
				.sort((l, r) => new Date(l.date).getTime() - new Date(r.date).getTime());
			const dueDate = cur.dueDate ? new Date(cur.dueDate) : null;

			const dates = cur.attempts.reduce((acc, cur) => {
				if (cur.date) {
					acc.push(cur.date);
				}
				return acc;
			}, []);
			const demonstrationDate = dates.length > 0 ? new Date(dates[0]) : null;

			// If a dueDate has passed, use dueDate. Otherwise, most recent demonstration date takes priority over dueDate
			const groupDate = dueDate && dueDate <= new Date() ? dueDate : demonstrationDate || dueDate;
			if (dueDate !== null || cur.attempts.length > 0) {
				cur.date = groupDate;
				acc.push(cur);
			}

			return acc;
		}, []).sort((a, b) => a.date.getTime() - b.date.getTime());
	}

};
