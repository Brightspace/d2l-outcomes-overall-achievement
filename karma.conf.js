/* eslint-env node */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = config => {
	config.set(
		merge(createDefaultConfig(config), {
			files: [
				{
					pattern: config.grep ? config.grep : 'test/**/*.tests.js',
					type: 'module'
				}
			],
			esm: {
				nodeResolve: true
			},
			client: {
				mocha: {
					timeout: 10000
				}
			}
		})
	);

	return config;
};
