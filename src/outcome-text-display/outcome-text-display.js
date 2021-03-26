import './outcome-text-skeleton.js';
import { bodySmallStyles, heading3Styles } from '@brightspace-ui/core/components/typography/styles';
import { css, html, LitElement } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { OutcomeEntity } from '../entities/OutcomeEntity';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

class OutcomeTextDisplay extends SkeletonMixin(EntityMixinLit(LocalizeMixin(LitElement))) {

	static get properties() {
		return {
			_outcomeName: { attribute: false },
			_outcomeNotation: { attribute: false }
		};
	}

	static get styles() {
		return [
			css`
				#outcome-name {
					margin-top: 0;
					margin-bottom: 18px;
				}
			`,
			heading3Styles,
			bodySmallStyles,
			super.styles
		];
	}

	constructor() {
		super();
		this._setEntityType(OutcomeEntity);

		this._outcomeName = '';
		this._outcomeNotation = '';
		this.skeleton = true;
	}

	static get is() { return 'd2l-coa-outcome-text-display'; }

	render() {
		return this.skeleton ? html`
			<d2l-coa-outcome-text-skeleton>
			</d2l-coa-outcome-text-skeleton>
		` : html`
			<h2 class="d2l-heading-3" id="outcome-name">${this._outcomeName}</h2>
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
			this.skeleton = false;
		}
	}

}

customElements.define(OutcomeTextDisplay.is, OutcomeTextDisplay);
