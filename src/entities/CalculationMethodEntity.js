import { Entity } from 'siren-sdk/src/es6/Entity';

export class CalculationMethodEntity extends Entity {
	static get class() { return 'calculation-method'; }

	getKey() {
		return this._entity && this._entity.properties && this._entity.properties.key;
	}

	getName() {
		return this._entity && this._entity.properties && this._entity.properties.name;
	}
}
