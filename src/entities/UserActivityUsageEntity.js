import { Entity } from 'siren-sdk/src/es6/Entity';
import { SelflessEntity } from 'siren-sdk/src/es6/SelflessEntity';

class ActivityNameEntity extends SelflessEntity {
	static get class() { return 'user-activity-name'; }

	getShortText() {
		return this._entity && this._entity.properties && this._entity.properties.shortText;
	}
}

export class UserActivityUsageEntity extends Entity {
	static get class() { return 'activity'; }
	static get links() {
		return {
			evalPage: 'checkpoint-consistent-evaluation'
		};
	}

	getEvalPageHref() {
		if (!this._entity || !this._entity.hasLinkByRel(UserActivityUsageEntity.links.evalPage)) {
			return;
		}

		return this._entity.getLinkByRel(UserActivityUsageEntity.links.evalPage).href;
	}

	getNameEntity() {
		if (!this._entity) {
			return;
		}

		const nameEntity = this._entity.getSubEntityByClass(ActivityNameEntity.class);
		return nameEntity && new ActivityNameEntity(this, nameEntity);
	}
}
