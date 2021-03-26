import { html, LitElement } from 'lit-element';

class Diamond extends LitElement {

	static get properties() {
		return {
			color: { type: String },
			edgeWidth: { attribute: 'edge-width', type: Number },
			width: { type: Number }
		};
	}

	static get is() { return 'd2l-coa-diamond'; }

	render() {
		let computedEdgeWidth, computedWidth;

		if (this.edgeWidth) {
			computedEdgeWidth = this.edgeWidth;
			computedWidth = Math.sqrt(2 * computedEdgeWidth * computedEdgeWidth);
		} else if (this.width) {
			computedWidth = this.width;
			computedEdgeWidth = Math.sqrt(computedWidth * computedWidth / 2);
		} else {
			return null;
		}

		return html`
			<svg
				width="${computedWidth}"
				height="${computedWidth}"
				viewBox="${computedWidth / -2} ${computedWidth / -2} ${computedWidth} ${computedWidth}"
				>
				<rect
					x="${computedEdgeWidth / -2}"
					y="${computedEdgeWidth / -2}"
					width="${computedEdgeWidth}"
					height="${computedEdgeWidth}"
					fill="${this.color}"
					transform="rotate(45)"
				/>
			</svg>
		`;
	}

}

customElements.define(Diamond.is, Diamond);
