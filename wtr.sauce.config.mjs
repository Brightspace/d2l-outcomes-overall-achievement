import { createSauceLabsLauncher } from '@web/test-runner-saucelabs';

const sauceLabsCapabilities = {
	name: 'Outcomes Overall Achievement Unit Tests',
	idleTimeout: 500
};
const sauceLabsConfig = {
	user: process.env.SAUCE_USERNAME,
	key: process.env.SAUCE_ACCESS_KEY
};
const sauceLabsLauncher = createSauceLabsLauncher(
	sauceLabsConfig,
	sauceLabsCapabilities
);

export default {
	files: 'test/**/*.js',
	nodeResolve: true,
	concurrentBrowsers: 4,
	browsers: [
		sauceLabsLauncher({
			browserName: 'chrome',
			browserVersion: 'latest',
			platformName: 'OS X 10.15'
		}),
		sauceLabsLauncher({
			browserName: 'firefox',
			browserVersion: 'latest',
			platformName: 'OS X 10.15'
		}),
		sauceLabsLauncher({
			browserName: 'safari',
			browserVersion: 'latest',
			platformName: 'OS X 10.15'
		}),
		sauceLabsLauncher({
			browserName: 'microsoftedge',
			browserVersion: 'latest',
			platformName: 'Windows 10'
		})
	],
	testFramework: {
		config: {
			timeout: '10000'
		}
	},
	browserStartTimeout: 1000 * 60 * 2,
	testsStartTimeout: 1000 * 60 * 2,
	testsFinishTimeout: 1000 * 60 * 2
};
