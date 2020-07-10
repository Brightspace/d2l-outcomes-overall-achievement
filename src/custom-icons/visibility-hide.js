import { LitElement, html, css } from 'lit-element';
import '@brightspace-ui/core/components/icons/icon-custom';

class VisibilityHideIcon extends LitElement {
	static get is() {
		return 'd2l-icon-visibility-hide';
	}

	static get styles() {
		return css`
            :host {
                display: flex;
            }

            d2l-icon-custom {
				height: 11.9px;
				width: 14px;
            }
            
            .cls-1, .cls-3, .cls-4 {
                fill: none;
            }
        
            .cls-1 {
                clip-rule: evenodd;
            }
        
            .cls-2 {
                clip-path: url(#clip-path);
            }
        
            .cls-3 {
                stroke: #6d7376;
                stroke-width: 4px;
            }
        `;
	}

	render() {
		return html`
            <d2l-icon-custom>
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="11.9" viewBox="0 0 14 11.9">
                    <defs>
                        <clipPath id="clip-path">
                            <path id="Path_8" data-name="Path 8" class="cls-1" d="M12.657-11.707a1,1,0,0,1,0,1.414l-9.9,9.9a1,1,0,0,1-1.414,0,1,1,0,0,1,0-1.414l9.9-9.9A1,1,0,0,1,12.657-11.707Zm-.272,3.1A3.215,3.215,0,0,1,14-6.05c0,2.209-3.134,4-7,4-.381,0-.755-.017-1.12-.051l.955-.954L7-3.05a3,3,0,0,0,3-3l-.006-.166ZM7-10.05c.382,0,.756.017,1.121.051l-.955.954L7-9.05a3,3,0,0,0-3,3l.005.166-2.39,2.39A3.215,3.215,0,0,1,0-6.05C0-8.259,3.134-10.05,7-10.05Z"/>
                        </clipPath>
                    </defs>
                    <g id="Group_13" data-name="Group 13" class="cls-2" transform="translate(0 12)">
                        <path id="Path_5" data-name="Path 5" class="cls-3" d="M12.657.293a1,1,0,0,1,0,1.414l-9.9,9.9a1,1,0,0,1-1.414-1.414l9.9-9.9A1,1,0,0,1,12.657.293Zm-.272,3.1A3.215,3.215,0,0,1,14,5.95c0,2.209-3.134,4-7,4-.381,0-.755-.017-1.12-.051l.955-.954L7,8.95a3,3,0,0,0,3-3l-.006-.166ZM7,1.95c.382,0,.756.017,1.121.051l-.955.954L7,2.95a3,3,0,0,0-3,3l.005.166-2.39,2.39A3.215,3.215,0,0,1,0,5.95C0,3.741,3.134,1.95,7,1.95Z" transform="translate(0 -12)"/>
                        <path id="Path_6" data-name="Path 6" class="cls-4" d="M0,0H14V-12H0Z"/>
                        <path id="Path_7" data-name="Path 7" class="cls-4" d="M-1,1H15V-13H-1Z"/>
                    </g>
                </svg>
            </d2l-icon-custom>
        `;
	}
}

customElements.define(VisibilityHideIcon.is, VisibilityHideIcon);

