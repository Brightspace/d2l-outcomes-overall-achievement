import { LitElement, html, css } from 'lit-element';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { labelStyles } from '@brightspace-ui/core/components/typography/styles';
import '@brightspace-ui/core/components/colors/colors';

export class AssessmentSummarySkeleton extends SkeletonMixin(LitElement) {

	static get is() {
		return 'd2l-coa-assessment-summary-skeleton';
	}

	static get properties() {
		return {};
	}

	static get styles() {
		return [
			css`
                #total-assessments-skeleton {
                    display: block;
					width: 6.7rem;
					height: 1rem;
					margin-bottom: 0.6rem;
					color: red;
                }

                .summary-bar-skeleton {
                    display: block;
                    width: 100%;
                    height: 18px;
                }
            `,
			labelStyles,
			super.styles
		];
	}

	constructor() {
		super();
		this.skeleton = true;
	}

	render() {
		return html`
        <p id="total-assessments-skeleton" class="d2l-label-text d2l-skeletize"></p>
        <div class="summary-bar-skeleton d2l-skeletize"></div>
		`;
	}
}

customElements.define(AssessmentSummarySkeleton.is, AssessmentSummarySkeleton);
