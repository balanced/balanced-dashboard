QUnit.testStart(function(test) {
	var module = test.module ? test.module : '';
	console.log('#' + module + " " + test.name + ": starting setup.");

	// Display an error if asynchronous operations are queued outside of
	// Ember.run.  You need this if you want to stay sane.
	Ember.testing = true;

	// turn off ajax async
	$.ajaxSetup({
		async: false
	});

	Ember.$('<style>#ember-testing-container { position: absolute; background: white; bottom: 0; right: 0; width: 640px; height: 600px; overflow: auto; z-index: 9999; border: 1px solid #ccc; } #ember-testing { zoom: 50%; }</style>').appendTo('head');
	Ember.$('<div id="ember-testing-container"><div id="ember-testing"></div></div>').appendTo('body');

	Ember.run(function() {
		window.setupBalanced('#ember-testing');

		Balanced.TEST = {};
		Balanced.THROTTLE = 0;
		Balanced.setupForTesting();

	});

	Ember.run(function() {
		window.Balanced.advanceReadiness();
	});

	Balanced.injectTestHelpers();

	window.Balanced.onLoad();

	// since we aren't using balanced.js, define its functions so we can stub them
	balanced = {};
	balanced.init = function() {}
	balanced.bankAccount = {
		validateRoutingNumber: function() {
			return true;
		},
		create: function() {}
	};
	balanced.card = {
		create: function() {}
	};

	// build up test fixtures
	stop();
	$.ajax({
		url: ENV.BALANCED.API + '/v1/api_keys',
		type: 'post'
	}).then(function(apiKey) {
		var secret = apiKey.secret;
		Balanced.Auth.setAPIKey(secret);
		return $.ajax({
			url: ENV.BALANCED.API + '/v1/marketplaces',
			type: 'post',
			headers: {
				'Authorization': Balanced.Utils.encodeAuthorization(secret)
			}
		});
	}).done(function(marketplace) {
		var marketplaceId = marketplace.id;
		var customerId = marketplace.owner_customer.id;

		Balanced.TEST.MARKETPLACE_ID = marketplaceId;
		Balanced.TEST.CUSTOMER_ID = customerId;

		Balanced.TEST.CUSTOMER_ROUTE = '/marketplaces/' +
			Balanced.TEST.MARKETPLACE_ID + '/customers/' +
			Balanced.TEST.CUSTOMER_ID;

		Balanced.TEST.MARKETPLACE_INDEX = '/marketplaces/';
		Balanced.TEST.MARKETPLACE_ROUTE = '/marketplaces/' +
			Balanced.TEST.MARKETPLACE_ID;

		var userMarketplace = Balanced.UserMarketplace.create({
			secret: Balanced.NET.defaultApiKey
		});
		userMarketplace.populateFromJsonResponse(marketplace);

		var user = Balanced.User.create({
			user_marketplaces: [userMarketplace],
			marketplaces_uri: '/users/' + customerId + '/marketplaces'
		});

		user.populateFromJsonResponse(marketplace.owner_customer);
		Balanced.Auth.setAuthProperties(true, user, customerId, Ember.get(Balanced.NET, 'defaultApiKey'), true);

		start();
		console.log('%@ %@: setup complete. Starting test'.fmt(module, test.name));
	});

	// What I'd like to do, but this fucks up
	// because of BS related to the test helpers
	/*
	Ember.run(function() {
		Balanced.Auth.createNewGuestUser().then(function(apiKey) {

			var apiKeySecret = apiKey.get('secret');
			var settings = {
				headers: {
					Authorization: Balanced.Utils.encodeAuthorization(apiKeySecret)
				}
			};
			return Balanced.Marketplace.create().save(settings);

		}).then(function(marketplace) {

			var uri = marketplace.get('uri');
			var id = uri.substr(uri.lastIndexOf('/') + 1);
			Balanced.Auth.setupGuestUserMarketplace(marketplace);

			Balanced.TEST.MARKETPLACE_ID = id;
			Balanced.TEST.CUSTOMER_ID = marketplace.get('owner_customer.id');
			Balanced.TEST.CUSTOMER_ROUTE = '/marketplaces/' +
				Balanced.TEST.MARKETPLACE_ID + '/customers/' +
				Balanced.TEST.CUSTOMER_ID;

			start();
			console.log('%@ %@: setup complete. Starting test'.fmt(module, test.name));
		
		});
	});
	*/

});

QUnit.testDone(function(test) {
	var module = test.module ? test.module : '';
	console.log('#%@ %@: tearing down.'.fmt(module, test.name));

	Balanced.removeTestHelpers();
	Ember.run(Balanced, Balanced.destroy);
	Balanced = null;
	Ember.$('#ember-testing-container, #ember-testing').remove();

	Ember.testing = false;

	console.log('#%@ %@: done.'.fmt(module, test.name));
});
