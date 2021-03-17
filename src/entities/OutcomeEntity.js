import { Entity } from 'siren-sdk/src/es6/Entity';

const _trim = function(str) {
	return (str && str.trim) ? str.trim() : null;
};

export class OutcomeEntity extends Entity {
	static get class() { return 'outcome'; }

	getAltNotation() {
		return this._entity && this._entity.properties && this._entity.properties.altNotation;
	}

	getDescription() {
		return this._entity && this._entity.properties && this._entity.properties.description;
	}

	getIdentifier() {
		if (!this._entity || !this._entity.properties) {
			return;
		}

		const props = this._entity.properties;

		const notation = _trim(this.getNotation()) || _trim(this.getAltNotation());
		const primarySubject = props.subjects && _trim(props.subjects.find(s => _trim(s)));

		const outcomeInfo = [
			primarySubject,
			_trim(props.label),
			_trim(props.listId)
		].filter(id => id).join(' ');

		if (outcomeInfo) {
			return notation ? `${notation} - ${outcomeInfo}` : outcomeInfo;
		}

		return notation || '';
	}

	getNotation() {
		return this._entity && this._entity.properties && this._entity.properties.notation;
	}

	getSelfHref() {
		return this._entity && this._entity.getLinkByRel('self').href;
	}
}
