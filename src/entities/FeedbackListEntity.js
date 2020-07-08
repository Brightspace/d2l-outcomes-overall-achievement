import { Entity } from 'siren-sdk/src/es6/Entity';
import { SelflessEntity } from 'siren-sdk/src/es6/SelflessEntity';

export class FeedbackListEntity extends Entity {
	static get class() { return 'feedback-list'; }

	getFeedback() {
		if (!this._entity) {
			return;
		}

		const feedbackEntities = this._entity.getSubEntitiesByClass(FeedbackEntity.class);
		const parentEntitiy = this;
		return feedbackEntities.map(entity => new FeedbackEntity(parentEntitiy, entity));
	}
}

export class FeedbackEntity extends SelflessEntity {
	static get class() { return 'feedback'; }

	getHtml() {
		return this._entity && this._entity.properties && this._entity.properties.html;
	}
	getText() {
		return this._entity && this._entity.properties && this._entity.properties.text;
	}

}
