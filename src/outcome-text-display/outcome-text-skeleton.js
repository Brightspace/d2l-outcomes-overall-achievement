import '@brightspace-ui/core/components/colors/colors';
import { bodySmallStyles, heading3Styles } from '@brightspace-ui/core/components/typography/styles';
import { css, html, LitElement } from 'lit-element';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

export class OutcomeTextSkeleton extends SkeletonMixin(LitElement) {

	static get properties() {
		return {};
	}

	static get styles() {
		return [
			css`
				#outcome-text-skeleton {
					margin-top: 0px;
					margin-bottom: 12px;
				}

				#outcome-level-skeleton {
					display: inline-block;
					text-align: left;
					width: 100px;
					margin-top: 0px;
				}
			`,
			heading3Styles,
			bodySmallStyles,
			super.styles
		];
	}

	constructor() {
		super();
		this.skeleton = true;
	}

	static get is() { return 'd2l-coa-outcome-text-skeleton'; }

	render() {
		return html`
			<p id="outcome-text-skeleton" class="d2l-heading-3 d2l-skeletize-paragraph-2">2-line</p>
			<p id="outcome-level-skeleton" class="d2l-body-small d2l-skeletize">1-line</p>
		`;
	}

}

customElements.define(OutcomeTextSkeleton.is, OutcomeTextSkeleton);
