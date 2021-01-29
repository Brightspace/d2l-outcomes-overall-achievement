import { Entity } from 'siren-sdk/src/es6/Entity';

export class OutcomeEntity extends Entity {
	static get class() { return 'outcome'; }

	getAltNotation() {
		return this._entity && this._entity.properties && this._entity.properties.altNotation;
	}

	getDescription() {
		return this._entity && this._entity.properties && this._entity.properties.description;
	}

	getNotation() {
		return this._entity && this._entity.properties && this._entity.properties.notation;
	}

	getSelfHref() {
		return this._entity && this._entity.getLinkByRel('self').href;
	}
}
