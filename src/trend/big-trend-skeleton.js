import { LitElement, html, css } from 'lit-element';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import '@brightspace-ui/core/components/colors/colors';

export class BigTrendSkeleton extends SkeletonMixin(LitElement) {

	static get is() {
		return 'd2l-coa-big-trend-skeleton';
	}

	static get properties() {
		return {};
	}

	static get styles() {
		return [
			css`			
                .d2l-skeletize {
                    height: 126px;
                }
                `,
			super.styles
		];
	}

	constructor() {
		super();
		this.skeleton = true;
	}

	render() {
		return html`
            <div class="d2l-skeletize"></div>
		`;
	}
}

customElements.define(BigTrendSkeleton.is, BigTrendSkeleton);
