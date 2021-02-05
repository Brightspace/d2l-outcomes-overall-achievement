import TBC from 'd2l-telemetry-browser-client';
import debounce from 'lodash-es/debounce';

const {
	Client,
	EventBody,
	PerformanceEventBody,
	TelemetryEvent
} = TBC;

const eventType = 'TelemetryEvent';
const sourceId = 'masteryview';
const sessionId = getUUID();

const markMasteryViewLoadStart = 'masteryViewLoadStart';
const markMasteryViewLoadEnd = 'masteryViewLoadEnd';

const debounced = {};
function debouncer(name, fn, wait) {
	if (!debounced[name]) {
		debounced[name] = debounce(fn, wait);
	}

	debounced[name]();
}

let defaultEndpoint = null;

export const TelemetryMixin = superclass => class extends superclass {
	static get properties() {
		return {
			_commonProperties: { attribute: false },
			telemetryEndpoint: {
				attribute: 'telemetry-endpoint',
				type: String
			},
			_sessionId: { attribute: false }
		};
	}

	constructor() {
		super();

		this.telemetryEndpoint = defaultEndpoint;
		this._sessionId = sessionId;
	}

	markMasteryViewLoadEnd() {
		this.perfMark(markMasteryViewLoadEnd);
		this._logAndDestroyPerformanceEvent({
			viewName: 'MasteryViewTable',
			startMark: markMasteryViewLoadStart,
			endMark: markMasteryViewLoadEnd,
			actionName: 'PageLoad'
		});
	}

	markMasteryViewLoadStart() {
		this.perfMark(markMasteryViewLoadStart);
	}

	perfMark(name) {
		if (!window.performance || !window.performance.mark) {
			return;
		}
		window.performance.mark(name);
	}

	setTelemetryEndpoint(endpoint) {
		defaultEndpoint = endpoint;
		this.telemetryEndpoint = defaultEndpoint;
	}

	_createEventBody(action, customData, bodyType = EventBody) {
		const customJson = Object.assign({}, this._getCommonProperties(), customData);
		const eventBody = new bodyType();

		return eventBody
			.setAction(action)
			.setTenantUrl(location.hostname)
			.addCustom('sessionId', this._sessionId || '')
			.setCustomJson(customJson);
	}

	_createPerformanceEventBody(action, customData) {
		return this._createEventBody(action, customData, PerformanceEventBody);
	}

	_getBsiVersion() {
		const scripts = Array.from(window.document.head.childNodes).filter(e => e.tagName === 'SCRIPT');
		const bsiRegex = /^https:\/\/s\.brightspace\.com\/lib\/bsi\/([^/]+)\//;
		for (let i = 0; i < scripts.length; i++) {
			if (!scripts[i].src) {
				continue;
			}
			const matches = scripts[i].src.match(bsiRegex);
			if (matches && matches[1]) {
				return matches[1];
			}
		}
		return 'dev';
	}

	_getCommonProperties() {
		if (!this._commonProperties) {
			this._commonProperties = Object.freeze({
				PageUrl: location.href,
				ReferrerUrl: window.document.referrer,
				LmsVersion: window.document.documentElement.dataset.appVersion,
				BsiVersion: this._getBsiVersion()
			});
		}
		return this._commonProperties;
	}

	_logAndDestroyPerformanceEvent({ viewName, startMark, endMark, actionName }, customData) {
		if (
			!window.performance
			|| !window.performance.measure
			|| !this._markExists(startMark)
			|| !this._markExists(endMark)
		) {
			return;
		}

		window.performance.measure(viewName, startMark, endMark);

		const eventBody = this._createPerformanceEventBody(actionName, customData)
			.addUserTiming(window.performance.getEntriesByName(viewName));
		this._logEvent(eventBody);

		window.performance.clearMarks(startMark);
		window.performance.clearMarks(endMark);
		window.performance.clearMeasures(viewName);
		return eventBody;
	}

	_logEvent(eventBody) {
		if (!eventBody || !this.telemetryEndpoint) {
			return;
		}

		const client = new Client({ endpoint: this.telemetryEndpoint });

		const event = new TelemetryEvent()
			.setDate(new Date())
			.setType(eventType)
			.setSourceId(sourceId)
			.setBody(eventBody);

		client.logUserEvent(event);
		return event;
	}

	_markExists(markName) {
		return window.performance.getEntriesByName(markName, 'mark').length > 0;
	}
};

function getUUID() {
	return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
