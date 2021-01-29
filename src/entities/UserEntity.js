import { Entity } from 'siren-sdk/src/es6/Entity';

export class UserEntity extends Entity {

	static get class() { return 'user'; }

	static get classes() {
		return {
			firstName: ['first', 'name'],
			lastName: ['last', 'name'],
		};
	}

	static get links() {
		return {
			firstName: 'https://api.brightspace.com/rels/first-name',
			lastName: 'https://api.brightspace.com/rels/last-name'
		};
	}

	getFirstName() {
		return this._getName(UserEntity.classes.firstName);
	}

	getLastName() {
		return this._getName(UserEntity.classes.lastName);
	}

	_getName(classNames) {
		return this._entity.getSubEntityByClasses(classNames).properties.name;
	}

}
