import { Entity } from 'siren-sdk/src/es6/Entity';
import { SelflessEntity } from 'siren-sdk/src/es6/SelflessEntity';
import { AchievementScaleEntity } from './AchievementScaleEntity';
import { CoaClasslistEntity } from './CoaClasslistEntity.js';
import { OutcomeEntity } from './OutcomeEntity.js';
import { CalculationMethodEntity } from './CalculationMethodEntity';

export class ClassOverallAchievementEntity extends Entity {

	static get actions() {
		return {
			releaseAll: 'release-all',
			retractAll: 'retract-all'
		};
	}

	static get links() {
		return {
			classlistRel: 'https://assessments.api.brightspace.com/rels/coa-classlist',
			calculationMethod: 'calculation-method',
			defaultScale: 'default-achievement-scale',
		};
	}

	getBulkReleaseAction() {
		if (!this._entity || !this._entity.hasActionByName(ClassOverallAchievementEntity.actions.releaseAll)) {
			return;
		}
		return this._entity.getActionByName(ClassOverallAchievementEntity.actions.releaseAll);
	}

	getBulkRetractAction() {
		if (!this._entity || !this._entity.hasActionByName(ClassOverallAchievementEntity.actions.retractAll)) {
			return;
		}
		return this._entity.getActionByName(ClassOverallAchievementEntity.actions.retractAll);
	}

	getCalculationMethodHref() {
		if (!this._entity || !this._entity.hasLinkByRel(ClassOverallAchievementEntity.links.calculationMethod)) {
			return;
		}

		return this._entity.getLinkByRel(ClassOverallAchievementEntity.links.calculationMethod).href;
	}

	getOutcomeClassProgressItems() {
		if (!this._entity) {
			return;
		}

		const progressItems = this._entity.getSubEntitiesByClass(OutcomeClassProgressEntity.class);
		return progressItems.map(item => new OutcomeClassProgressEntity(this, item));
	}

	onCalculationMethodChanged(onChange) {
		const href = this.getCalculationMethodHref();
		href && this._subEntity(CalculationMethodEntity, href, onChange);
	}

	onClasslistChanged(onChange) {
		const href = this._classlistHref();
		href && this._subEntity(CoaClasslistEntity, href, onChange);
	}

	onDefaultScaleChanged(onChange) {
		const href = this._defaultScaleHref();
		href && this._subEntity(AchievementScaleEntity, href, onChange);
	}

	_classlistHref() {
		if (!this._entity || !this._entity.hasLinkByRel(ClassOverallAchievementEntity.links.classlistRel)) {
			return;
		}
		return this._entity.getLinkByRel(ClassOverallAchievementEntity.links.classlistRel).href;
	}

	_defaultScaleHref() {
		if (!this._entity || !this._entity.hasLinkByRel(ClassOverallAchievementEntity.links.defaultScale)) {
			return;
		}
		return this._entity.getLinkByRel(ClassOverallAchievementEntity.links.defaultScale).href;
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
