import { Entity } from 'siren-sdk/src/es6/Entity';
import { SelflessEntity } from 'siren-sdk/src/es6/SelflessEntity';
import { DemonstrationEntity } from './DemonstrationEntity';

class MasteryViewCellEntity extends SelflessEntity {

	static get class() { return 'mastery-view-cell'; }

	static get entities() {
		return {
			checkpointDemonstrationRel: 'checkpoint-demonstration'
		};
	}

	static get links() {
		return {
			outcomeRel: 'https://outcomes.api.brightspace.com/rels/outcome',
			evaluationRel: 'checkpoint-consistent-evaluation'
		};
	}

	getActivityCount() {
		return this._entity && this._entity.properties && this._entity.properties.ActivityCount;
	}

	getAssessedActivityCount() {
		return this._entity && this._entity.properties && this._entity.properties.AssessedActivityCount;
	}

	getEvaluationHref() {
		if (!this._entity || !this._entity.hasLinkByRel(MasteryViewCellEntity.links.evaluationRel)) {
			return;
		}

		return this._entity.getLinkByRel(MasteryViewCellEntity.links.evaluationRel).href;
	}

	getOutcomeHref() {
		if (!this._entity || !this._entity.hasLinkByRel(MasteryViewCellEntity.links.outcomeRel)) {
			return;
		}

		return this._entity.getLinkByRel(MasteryViewCellEntity.links.outcomeRel).href;
	}

	isOutdated() {
		return this._entity && this._entity.properties && this._entity.properties.IsOutdated === true;
	}

	onCheckpointDemonstrationChanged(onChange) {
		const demonstration = this._getCheckpointDemonstration();
		demonstration && this._subEntity(DemonstrationEntity, demonstration, onChange);
	}

	_getCheckpointDemonstration() {
		if (!this._entity || !this._entity.hasSubEntityByRel(MasteryViewCellEntity.entities.checkpointDemonstrationRel)) {
			return;
		}

		return this._entity.getSubEntityByRel(MasteryViewCellEntity.entities.checkpointDemonstrationRel);
	}

}

export class MasteryViewRowEntity extends Entity {

	static get class() { return 'mastery-view-row'; }

	getCells() {
		if (!this._entity) {
			return;
		}

		const cells = this._entity.getSubEntitiesByClass(MasteryViewCellEntity.class);
		return cells.map(cell => new MasteryViewCellEntity(this, cell));
	}

}
