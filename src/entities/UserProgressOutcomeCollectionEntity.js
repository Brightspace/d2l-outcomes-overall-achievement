import { Entity } from 'siren-sdk/src/es6/Entity';
import { UserProgressOutcomeEntity } from './UserProgressOutcomeEntity.js';
export class UserProgressOutcomeCollectionEntity extends Entity {
	static get links() {
		return {
			defaultAchievementScale: 'default-achievement-scale'
		};
	}

	getUserProgressOutcomes() {
		if (!this._entity) {
			return;
		}

		const outcomes = this._entity.getSubEntitiesByClass(UserProgressOutcomeEntity.class);
		return outcomes.map(outcome => new UserProgressOutcomeEntity(outcome, this._token));
	}

	onUserProgressOutcomeChanged(onChange) {
		const outcomes = this.getUserProgressOutcomes();
		outcomes.forEach((outcome, index) => {
			const onChangeWithIndex = (a) => {
				if (a) {
					a.index = index;
				}
				onChange(a);
			};

			outcome && this._subEntity(UserProgressOutcomeEntity, outcome, onChangeWithIndex);
		});
	}
}
