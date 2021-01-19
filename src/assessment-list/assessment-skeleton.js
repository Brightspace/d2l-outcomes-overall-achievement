import { LitElement, html, css } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import '@brightspace-ui/core/components/colors/colors';

export class AssessmentSkeleton extends SkeletonMixin(EntityMixinLit(LocalizeMixin(LitElement))) {

	static get is() {
		return 'd2l-coa-assessment-skeleton';
	}

	static get properties() {
		return {};
	}

	static get styles() {
		return [
			css`			
				@keyframes border-pulse {
					from { border-color: var(--d2l-color-gypsum); }
					to { border-color: var(--d2l-color-sylvite); }
				}
				
				.skeleton-container {
					display: flex;
					height: 124px;
					margin-bottom: 18px;
				}
				
				.timeline {
					flex-grow: 0;
					flex-shrink: 0;
				}
				
				.card {
					display: flex;
					flex-grow: 1;
					flex-shrink: 1;
					height: 100%;
					border-radius: 4px;
					padding: 17px 23px 20px 23px;
					box-sizing: border-box;
					border: 1px solid;
					animation-name: border-pulse;
					animation-duration: 0.9s;
					animation-direction: alternate;
					animation-iteration-count: infinite;
				}
				
				.icon {
					margin: 18px;
					width: 24px;
					height: 24px;
					border-radius: 4px;
				}
				
				.card-right {
					flex-grow: 0;
					flex-shrink: 0;
					border-radius: 50%;
					width: 24px;
					height: 24px;
				}
				
				.card-left {
					margin-top: 7px;
					margin-right: 37px;
					flex-grow: 1;
					flex-shrink: 1;
				}
				
				.card-top {
					margin-bottom: 26px;
					width: 38%;
					height: 14px;
					border-radius: 4px;
				}
				
				.card-bottom {
					display: flex;
				}
				
				.mini-icon {
					width: 15px;
					height: 15px;
					flex-grow: 0;
					flex-shrink: 0;
					border-radius: 4px;
				}
				
				.lines {
					margin-left: 15px;
					flex-grow: 1;
					flex-shrink: 1;
				}
				
				.line {
					width: 100%;
					height: 10px;
					margin-top: 4px;
					margin-bottom: 9px;
					border-radius: 4px;
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
			<div class="skeleton-container">
				<div class="timeline">
					<div class="icon d2l-skeletize"></div>
				</div>
				<div class="card">
					<div class="card-left">
						<div class="card-top d2l-skeletize"></div>
						<div class="card-bottom">
							<div class="mini-icon d2l-skeletize"></div>
							<div class="lines">
								<div class="line d2l-skeletize"></div>
								<div class="line d2l-skeletize"></div>
							</div>
						</div>
					</div>
					<div class="card-right d2l-skeletize"></div>
				</div>
			</div>
		`;
	}
}

customElements.define(AssessmentSkeleton.is, AssessmentSkeleton);
