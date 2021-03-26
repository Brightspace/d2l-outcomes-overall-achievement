import { css, html, LitElement } from 'lit-element';
import '@brightspace-ui/core/components/icons/icon-custom';

class QuoteIcon extends LitElement {

	static get styles() {
		return css`
			:host {
				display: flex;
			}

			d2l-icon-custom {
				height: 11px;
				width: 11px;
			}
		`;
	}

	static get is() { return 'd2l-icon-quote'; }

	render() {
		return html`
			<d2l-icon-custom>
				<svg width="11" height="11" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<defs>
						<path id="a" d="M0 0h24v24H0z"/>
					</defs>
					<g transform="translate(-1 -1)" fill="none" fill-rule="evenodd">
						<mask id="b" fill="#fff">
							<use xlink:href="#a"/>
						</mask>
						<path d="M6 22.667A4.667 4.667 0 0 0 10.667 18c0-1.227-.559-2.5-1.334-3.333C8.481 13.75 7.35 13.333 6 13.333c-.411 0 1.333-6.666 3-9 1.667-2.333 1.333-3 .333-3C8 1.333 5.253 4.586 4 7.255 1.773 12 1.333 15.392 1.333 18A4.667 4.667 0 0 0 6 22.667zM18 22.667A4.667 4.667 0 0 0 22.667 18c0-1.227-.559-2.5-1.334-3.333-.852-.917-1.983-1.334-3.333-1.334-.411 0 1.333-6.666 3-9 1.667-2.333 1.333-3 .333-3-1.333 0-4.08 3.253-5.333 5.922C13.773 12 13.333 15.392 13.333 18A4.667 4.667 0 0 0 18 22.667z" fill="#D3D9E3" mask="url(#b)"/>
					</g>
				</svg>
			</d2l-icon-custom>
		`;
	}

}

customElements.define(QuoteIcon.is, QuoteIcon);
