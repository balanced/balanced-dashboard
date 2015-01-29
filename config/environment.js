module.exports = function(environment) {
	var ENV = {
		contentSecurityPolicyHeader: "Content-Security-Policy-Report-Only",
		modulePrefix: 'balanced-dashboard',
		rootElement: "#balanced-app",
		environment: environment,
		baseURL: '/',
		locationType: 'auto',
		EmberENV: {
			FEATURES: {}
		},
		APP: {
			USE_MARKETPLACE_APPLICATION: false
		},
		BALANCED: {
			API: 'https://api.balancedpayments.com',
			AUTH: 'https://auth.balancedpayments.com',
			JUSTITIA: 'https://justitia.balancedpayments.com',
			WWW: 'https://www.balancedpayments.com',
			DOCS: 'https://docs.balancedpayments.com',
			DEBUG: environment !== "production",
			MIXPANEL: '',
			GOOGLE_ANALYTICS: ''
		}
	};

	if (environment === "development") {
		ENV.APP.LOG_ACTIVE_GENERATION = true;
//		ENV.APP.LOG_TRANSITIONS = true;
//		ENV.APP.LOG_VIEW_LOOKUPS = true;
	}

	if (environment === 'test') {
		ENV.rootElement = '#ember-testing';
	}

	if (environment === 'production') {
		ENV.BALANCED.MIXPANEL = '991598fc644dd5d0894e6cb070154330';
		ENV.BALANCED.GOOGLE_ANALYTICS = 'UA-30733850-1';
	}
	return ENV;
};
