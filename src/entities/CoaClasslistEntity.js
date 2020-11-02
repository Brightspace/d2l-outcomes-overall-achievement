import { Entity } from 'siren-sdk/src/es6/Entity';
import { SelflessEntity } from 'siren-sdk/src/es6/SelflessEntity';
import { UserEntity } from './UserEntity.js';
import { UserProgressOutcomeCollectionEntity } from './UserProgressOutcomeCollectionEntity.js';

export class CoaClasslistEntity extends Entity {

	getUsers() {
		if (!this._entity) {
			return;
		}

		const users = this._entity.getSubEntitiesByClass(CoaUserEntity.class);
		return users.map(user => new CoaUserEntity(this, user));
	}

}

class CoaUserEntity extends SelflessEntity {

	static get class() { return 'checkpoint-user'; }

	static get links() {
		return {
			rowDataRel: 'https://mastery.api.brightspace.com/rels/row-data',
			userRel: 'user',
			userGradesSummaryRel: 'https://api.brightspace.com/rels/user-grades-view',
			userProgressOutcomeRel: 'https://user-progress.api.brightspace.com/rels/user-progress-checkpoint-outcomes'
		};
	}

	getFirstName() {
		return this._entity && this._entity.properties && this._entity.properties.FirstName;
	}

	getLastName() {
		return this._entity && this._entity.properties && this._entity.properties.LastName;
	}

	getRowDataHref() {
		if (!this._entity || !this._entity.hasLinkByRel(CoaUserEntity.links.rowDataRel)) {
			return;
		}

		return this._entity.getLinkByRel(CoaUserEntity.links.rowDataRel).href;
	}

	getUserGradesSummaryHref() {
		if (!this._entity || !this._entity.hasLinkByRel(CoaUserEntity.links.userGradesSummaryRel)) {
			return;
		}

		return this._entity.getLinkByRel(CoaUserEntity.links.userGradesSummaryRel).href;
	}

	getUserProgressOutcomesHref() {
		if (!this._entity || !this._entity.hasLinkByRel(CoaUserEntity.links.userProgressOutcomeRel)) {
			return;
		}

		return this._entity.getLinkByRel(CoaUserEntity.links.userProgressOutcomeRel).href;
	}

	onUserChanged(onChange) {
		const href = this._userHref();
		href && this._subEntity(UserEntity, href, onChange);
	}

	onUserProgressOutcomesChanged(onChange) {
		const href = this.getUserProgressOutcomesHref();
		href && this._subEntity(UserProgressOutcomeCollectionEntity, href, onChange);
	}

	_userHref() {
		if (!this._entity || !this._entity.hasLinkByRel(CoaUserEntity.links.userRel)) {
			return;
		}

		return this._entity.getLinkByRel(CoaUserEntity.links.userRel).href;
	}
}
