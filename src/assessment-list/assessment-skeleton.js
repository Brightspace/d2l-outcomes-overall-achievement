import { css, html, LitElement } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { LocalizeMixin } from '../LocalizeMixin';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import '@brightspace-ui/core/components/colors/colors';

export class AssessmentSkeleton extends SkeletonMixin(EntityMixinLit(LocalizeMixin(LitElement))) {

	static get properties() {
		return {};
	}

	static get styles() {
		return [
			css`
				.skeleton-container {
					display: flex;
					height: 124px;
					margin-bottom: 18px;
				}

				.timeline {
					flex-grow: 0;
					flex-shrink: 0;
				}

				.card-container {
					display: flex;
					-webkit-flex-wrap: wrap;
					flex-wrap: wrap;
					flex-grow: 1;
					flex-shrink: 1;
					height: 100%;
				}

				.card-horizontal-border {
					display: block;
					width: 100%;
					height: 2px;
					margin: 0px;
				}

				.card-vertical-border {
					display: inline-block;
					width: 2px;
					height: 100%;
					margin: 0;
				}

				.card {
					display: flex;
					flex-grow: 1;
					padding: 17px 23px 20px 23px;
					margin: -2px;
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

				#line-spacer {
					width: 15px;
				}
			`,
			super.styles
		];
	}

	constructor() {
		super();
		this.skeleton = true;
	}

	static get is() { return 'd2l-coa-assessment-skeleton'; }

	render() {
		return html`
			<div class="skeleton-container">
				<div class="timeline">
					<div class="icon d2l-skeletize"></div>
				</div>
				<div class="card-container">
					<div class="card-horizontal-border d2l-skeletize"></div>
					<div class="card-vertical-border d2l-skeletize"></div>
					<div class="card d2l-skeletize-container">
						<div class="card-left">
							<div class="card-top d2l-skeletize"></div>
							<div class="card-bottom">
								<div class="mini-icon d2l-skeletize"></div>
								<div id="line-spacer"></div>
								<div class="lines">
									<div class="line d2l-skeletize"></div>
									<div class="line d2l-skeletize"></div>
								</div>
							</div>
						</div>
						<div class="card-right d2l-skeletize"></div>
					</div>
					<div class="card-vertical-border d2l-skeletize"></div>
					<div class="card-horizontal-border d2l-skeletize"></div>
				</div>
			</div>
		`;
	}

}

customElements.define(AssessmentSkeleton.is, AssessmentSkeleton);
