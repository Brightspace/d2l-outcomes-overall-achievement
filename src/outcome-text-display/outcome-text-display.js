import { LitElement, html, css } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { heading3Styles, bodySmallStyles } from '@brightspace-ui/core/components/typography/styles';
import { OutcomeEntity } from '../entities/OutcomeEntity';

class OutcomeTextDisplay extends EntityMixinLit(LocalizeMixin(LitElement)) {
	static get is() {
		return 'd2l-coa-outcome-text-display';
	}

	static get properties() {
		return {
			_outcomeName: { attribute: false },
			_outcomeNotation: { attribute: false }
		}
	}

	static get styles() {
		return [
			heading3Styles,
			bodySmallStyles
		];
	}

	constructor() {
		super();
		this._setEntityType(OutcomeEntity);

		this._outcomeName = "";
		this._outcomeNotation = "";
	}

	render() {
		return html` 
			<div class="d2l-heading-3">${this._outcomeName}</div>
			<div class="d2l-body-small">${this._outcomeNotation}</div>
		`;
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	_onEntityChanged(entity) {
		if (entity) {
			this._outcomeName = entity.getDescription();
			this._outcomeNotation = entity.getNotation() || entity.getAltNotation();
		}
	}
}

customElements.define(OutcomeTextDisplay.is, OutcomeTextDisplay);
