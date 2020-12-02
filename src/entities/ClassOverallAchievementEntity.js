import { Entity } from 'siren-sdk/src/es6/Entity';
import { SelflessEntity } from 'siren-sdk/src/es6/SelflessEntity';
import { CoaClasslistEntity } from './CoaClasslistEntity.js';
import { OutcomeEntity } from './OutcomeEntity.js';

export class ClassOverallAchievementEntity extends Entity {

	static get links() {
		return {
			classlistRel: 'https://assessments.api.brightspace.com/rels/coa-classlist',
		};
	}

	getOutcomeClassProgressItems() {
		if (!this._entity) {
			return;
		}

		const progressItems = this._entity.getSubEntitiesByClass(OutcomeClassProgressEntity.class);
		return progressItems.map(item => new OutcomeClassProgressEntity(this, item));
	}

	onClasslistChanged(onChange) {
		const href = this._classlistHref();
		href && this._subEntity(CoaClasslistEntity, href, onChange);
	}

	getBulkReleaseAction() {
		if (!this._entity || !this._entity.hasActionByName('release-all')) {
			return;
		}
		return this._entity.getActionByName('release-all');
	}

	getBulkRetractAction() {
		if (!this._entity || !this._entity.hasActionByName('retract-all')) {
			return;
		}
		return this._entity.getActionByName('retract-all');
	}

	_classlistHref() {
		if (!this._entity || !this._entity.hasLinkByRel(ClassOverallAchievementEntity.links.classlistRel)) {
			return;
		}
		return this._entity.getLinkByRel(ClassOverallAchievementEntity.links.classlistRel).href;
	}
}

class OutcomeClassProgressEntity extends SelflessEntity {

	static get class() { return 'outcome-checkpoint-item'; }
	static get links() {
		return {
			outcomeRel: 'https://outcomes.api.brightspace.com/rels/outcome',
			outcomeActivityCollectionRel: 'https://user-progress.api.brightspace.com/rels/checkpoint-class-progress'
		};
	}

	getOutcomeActivityCollectionHref() {
		if (!this._entity || !this._entity.hasLinkByRel(OutcomeClassProgressEntity.links.outcomeActivityCollectionRel)) {
			return;
		}
		return this._entity.getLinkByRel(OutcomeClassProgressEntity.links.outcomeActivityCollectionRel).href;
	}

	onOutcomeChanged(onChange) {
		const href = this._outcomeHref();
		href && this._subEntity(OutcomeEntity, href, onChange);
	}

	_outcomeHref() {
		if (!this._entity || !this._entity.hasLinkByRel(OutcomeClassProgressEntity.links.outcomeRel)) {
			return;
		}

		return this._entity.getLinkByRel(OutcomeClassProgressEntity.links.outcomeRel).href;
	}
}
