import { LitElement, html, css } from 'lit-element';
import '@brightspace-ui/core/components/icons/icon-custom.js';

class RightArrowIcon extends LitElement {
	static get is() {
		return 'd2l-icon-right-arrow';
	}

	static get properties() {
		return {
			hidden: {type: Boolean, attribute: 'hidden'}
		};
	}

	static get styles() {
		return css`
			:host {
				display: flex;
			}

			.icon-container {
				padding-left: 6px;
				padding-right: 6px;
			}
			
			.empty-icon-container {
				padding-left: 9px;
				padding-right: 9px;
			}
		`;
	}

	render() {
		return this.hidden ? html`
			<div class="empty-icon-container"></div>
		` : html`
			<div class="icon-container">
				<svg xmlns="http://www.w3.org/2000/svg" width="6" height="10.01" viewBox="0 0 6 10.01">
					<path id="RightArrow" d="M9.714,4.29l-4-4A1.012,1.012,0,0,0,4.3.29l-4,4A1,1,0,0,0,1.021,6H9.014a1,1,0,0,0,.7-1.71Z" transform="translate(6) rotate(90)" fill="#565a5c"/>
				</svg>
			</div>
		`;
	}
}

customElements.define(RightArrowIcon.is, RightArrowIcon);

