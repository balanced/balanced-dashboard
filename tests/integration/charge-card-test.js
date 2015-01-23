import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Charge Card', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.createCard();
	},
	teardown: function() {
		Testing.restoreMethods(
			balanced.card.create,
			Adapter.create
		);
		Ember.run(App, "destroy");
	}
});

test('form validation', 2, function() {
	visit(Testing.TRANSACTIONS_ROUTE)
		.click('.page-navigation a:contains(Debit a card)')
		.checkElements({
			"#charge-card button:contains(Debit)": 1
		})
		.click('button:contains(Debit)')
		.check("#charge-card .form-group.has-error", 6);
});
