import { AchievementScaleEntity } from './AchievementScaleEntity';
import { Entity } from 'siren-sdk/src/es6/Entity';
import { SelflessEntity } from 'siren-sdk/src/es6/SelflessEntity';

export class OutcomeLevelCountEntity extends SelflessEntity {

	static get class() { return 'class-progress-loa-level-count'; }

	getCount() {
		return this._entity && this._entity.properties && this._entity.properties.count;
	}

	getLevelId() {
		return this._entity && this._entity.properties && this._entity.properties.levelId;
	}

}

export class OutcomeLevelDistributionEntity extends Entity {

	static get class() { return 'class-progress-loa-level-distribution'; }

	static get links() {
		return {
			defaultAchievementScale: 'default-achievement-scale'
		};
	}

	getCounts() {
		if (!this._entity) {
			return;
		}

		const counts = this._entity.getSubEntitiesByClass(OutcomeLevelCountEntity.class);

		return counts.map(count => new OutcomeLevelCountEntity(this, count));
	}

	onDefaultScaleChanged(onChange) {
		const href = this._defaultScaleHref();

		href && this._subEntity(AchievementScaleEntity, href, onChange);
	}

	_defaultScaleHref() {
		if (!this._entity || !this._entity.hasLinkByRel(OutcomeLevelDistributionEntity.links.defaultAchievementScale)) {
			return;
		}

		return this._entity.getLinkByRel(OutcomeLevelDistributionEntity.links.defaultAchievementScale).href;
	}

}
