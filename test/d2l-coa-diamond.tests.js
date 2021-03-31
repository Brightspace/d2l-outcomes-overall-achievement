import '../src/diamond/diamond.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<d2l-coa-diamond>', () => {
	let element;

	beforeEach(async() => {
		element = await fixture(html`
			<d2l-coa-diamond></d2l-coa-diamond>
		`);
	});

	describe('smoke test', () => {
		it('can be instantiated', () => {
			expect(element.tagName).to.equal('D2L-COA-DIAMOND');
		});
	});

	describe('accessibility tests', () => {
		it('should pass all axe tests', () => {
			expect(element).to.be.accessible();
		});
	});
});
