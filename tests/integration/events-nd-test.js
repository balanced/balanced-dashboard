import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Events (non-deterministic)', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.createDebit();
		Testing.createCustomer();
		Testing.createCredit();
		Testing.setupEvent();
	},
	teardown: function() {
		Ember.run(App, 'destroy');
	}
});

test('can visit page', function() {
	var elements = {
		'.event-info dl dt': 4,
		'.event-info dl dd': 4,
		'.prettyprint': {
			count: 1,
			classNames: 'lang-js',
			hasText: true
		},
		'.event-data-info h3': 'Event data',
		'.webhook-info h3': 'Webhooks'
	};

	visit(Testing.EVENT_ROUTE)
		.checkElements(elements);
});
