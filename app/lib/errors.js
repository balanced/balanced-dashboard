var delegateToRaven = function(methodName) {
	var Raven = window.Raven;

	return function() {
		if (Raven) {
			Raven[methodName].apply(Raven, arguments);
		}
	};
};

Balanced.ErrorsLogger = Ember.Namespace.create({
	captureMessage: delegateToRaven('captureMessage'),
	captureException: delegateToRaven('captureException'),
	isExpectedStatusCode: function(statusCode) {
		return statusCode >= 400 && statusCode < 500;
	},
	isExpectedError: function(error) {
		if (error === undefined || error === null) {
			return true;
		} else if (error.message === "TransitionAborted") {
			return true;
		} else if (error.get) {
			if (!error.get("isValid")) {
				return true;
			} else if (error.get("isError")) {
				return Balanced.ErrorsLogger.isExpectedStatusCode(error.get("errorStatusCode"));
			}
			return false;
		} else if (error.errors) {
			return error.errors.every(function(err) {
				return Balanced.ErrorsLogger.isExpectedStatusCode(err.status_code);
			});
		}
		return false;
	}
});

var reportError = function(error) {
	if (Balanced.ErrorsLogger.isExpectedError(error)) {
		return;
	}

	var realError = error.stack || error;

	if (!ENV.BALANCED.DEBUG) {
		var data = {
			text: error.message || realError.toString(),
			location: window.location.toString()
		};

		if (Balanced.currentMarketplace) {
			data.marketplaceId = Balanced.currentMarketplace.get('id');
			data.marketplaceName = Balanced.currentMarketplace.get('name');
		}

		Balanced.ErrorsLogger.captureException(error, {
			tags: data
		});

		Balanced.Analytics.trackEvent('js-error', data);
	}

	Ember.Logger.error(realError);
};

if ('undefined' !== typeof Raven) {
	Raven.config('https://c5e331a1bd9c47af85d481e46b415dab@app.getsentry.com/6353').install();
}

Ember.onerror = reportError;
Ember.RSVP.configure('onerror', reportError);
