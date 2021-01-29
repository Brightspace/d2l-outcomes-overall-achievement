const _sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);

export class ErrorLogger {

	constructor(loggingEndpoint, onApiError) {
		this._getEndpoint = (typeof loggingEndpoint === 'function') ? loggingEndpoint : () => loggingEndpoint;
		this._onApiError = onApiError || (() => null);

		this._logError = this._logError.bind(this);
		this.logJavascriptError = this.logJavascriptError.bind(this);
		this.logPromiseError = this.logPromiseError.bind(this);
		this.logSirenError = this.logSirenError.bind(this);
	}

	logJavascriptError(errorEvent) {
		if (errorEvent['message'] && errorEvent.message['startsWith'] && errorEvent.message.startsWith('ResizeObserver')) {
			// Ignore warnings from ResizeObserver
			return;
		}

		if (errorEvent['error'] && errorEvent.error['name'] === 'NetworkError') {
			// Ignore network errors
			return;
		}

		this._logError('JavascriptError', {
			Name: (errorEvent['error'] && typeof errorEvent.error['name'] === 'string') ? errorEvent.error.name : typeof errorEvent,
			Message: errorEvent['message'] || '',
			Source: errorEvent['filename'] || null,
			Line: typeof errorEvent['lineno'] === 'number' ? errorEvent.lineno : null,
			Column: typeof errorEvent['colno'] === 'number' ? errorEvent.colno : null,
			Details: (typeof errorEvent['toString'] === 'function') ? errorEvent.toString() : null
		});
	}

	logPromiseError(rejectionEvent) {
		const promiseError = rejectionEvent.reason;
		this._onApiError(promiseError);
		if (typeof promiseError === 'string') {
			this._logError('JavascriptError', {
				Name: 'PromiseRejectionEvent',
				Message: promiseError,
				Details: promiseError
			});
		} else {
			this._logError('JavascriptError', {
				Name: 'PromiseRejectionEvent',
				Message: (promiseError && typeof promiseError['message'] === 'string') ? promiseError.message : null,
				Details: (promiseError && typeof promiseError['toString'] === 'function') ? promiseError.toString() : null
			});
		}
	}

	logSirenError(href, method, error) {
		this._onApiError(error);
		if (!href) {
			return;
		}

		this._logError('ApiError', {
			RequestUrl: href,
			RequestMethod: method || 'GET',
			ResponseStatus: (error && error['detail'] && typeof error.detail['error'] === 'number') ? error.detail.error : null,
			Details: (error && typeof error['toString'] === 'function') ? error.toString() : null
		});
	}

	_logError(errorType, errorData) {
		window.fetch(
			this._getEndpoint(),
			{
				method: 'POST',
				mode: 'no-cors',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify([{
					Type: errorType,
					SessionId: _sessionId,
					Location: window.location.pathname,
					Referrer: document.referrer || null,
					Error: errorData
				}])
			}
		);
	}

}
