import { Entity } from 'siren-sdk/src/es6/Entity';
import { DemonstrationEntity } from './DemonstrationEntity';
import { UserActivityUsageEntity } from './UserActivityUsageEntity';

export class OutcomeActivityEntity extends Entity {
	static get class() { return 'user-progress-outcome-activity'; }

	static get links() {
		return {
			submissionLink: 'https://user-progress.api.brightspace.com/rels/submission-link',
			userActivityUsage: 'https://activities.api.brightspace.com/rels/user-activity-usage'
		};
	}

	getDueDate() {
		return this._entity && this._entity.properties && this._entity.properties.dueDate;
	}

	getName() {
		return this._entity && this._entity.properties && this._entity.properties.name;
	}

	getSelfHref() {
		if (!this._entity || !this._entity.hasLinkByRel('self')) {
			return null;
		}

		return this._entity.getLinkByRel('self').href;
	}

	getSubmissionLinkHref() {
		if (!this._entity || !this._entity.hasLinkByRel(OutcomeActivityEntity.links.submissionLink)) {
			return;
		}

		return this._entity.getLinkByRel(OutcomeActivityEntity.links.submissionLink).href;
	}

	getType() {
		return this._entity && this._entity.properties && this._entity.properties.type;
	}

	onAssessedDemonstrationChanged(onChange) {
		const assessedDemonstrations = this._getAssessedDemonstrations();
		assessedDemonstrations.forEach((demonstration, index) => {
			const onChangeWithIndex = (x) => {
				x.index = index;
				onChange(x);
			};
			demonstration && this._subEntity(DemonstrationEntity, demonstration, onChangeWithIndex);
		});
	}

	onUserActivityUsageChanged(onChange) {
		const href = this._userActivityUsageHref();
		href && this._subEntity(UserActivityUsageEntity, href, onChange);
	}

	_getAssessedDemonstrations() {
		if (!this._entity) {
			return;
		}

		return this._entity.entities ? this._entity.getSubEntitiesByClasses([DemonstrationEntity.class, DemonstrationEntity.classes.assessed]) : [];
	}

	_userActivityUsageHref() {
		if (!this._entity || !this._entity.hasLinkByRel(OutcomeActivityEntity.links.userActivityUsage)) {
			return;
		}

		return this._entity.getLinkByRel(OutcomeActivityEntity.links.userActivityUsage).href;
	}
}
