import { css, html, LitElement } from 'lit-element';
import '@brightspace-ui/core/components/icons/icon-custom';

class VisibilityShowIcon extends LitElement {

	static get styles() {
		return css`
			:host {
				display: flex;
			}

			d2l-icon-custom {
				height: 14px;
				width: 16px;
			}
		`;
	}

	static get is() { return 'd2l-icon-visibility-show'; }

	render() {
		return html`
			<d2l-icon-custom>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14">
					<path fill="#6E7376" fill-rule="evenodd" d="M8,3 C11.8659932,3 15,4.790861 15,7 C15,9.209139 11.8659932,11 8,11 C4.13400675,11 1,9.209139 1,7 C1,4.790861 4.13400675,3 8,3 Z M8,4 C6.34314575,4 5,5.34314575 5,7 C5,8.65685425 6.34314575,10 8,10 C9.65685425,10 11,8.65685425 11,7 C11,5.34314575 9.65685425,4 8,4 Z M8,6 C8.55228475,6 9,6.44771525 9,7 C9,7.55228475 8.55228475,8 8,8 C7.44771525,8 7,7.55228475 7,7 C7,6.44771525 7.44771525,6 8,6 Z"/>
				</svg>
			</d2l-icon-custom>
		`;
	}

}

customElements.define(VisibilityShowIcon.is, VisibilityShowIcon);
