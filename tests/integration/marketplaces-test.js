import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";
import Cookies from "balanced-dashboard/utils/constants/cookie";

var App, Adapter, Auth;

module('Integration - Marketplaces.Index', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Auth = App.__container__.lookup("auth:main");
		Testing.setupMarketplace();
		this.fakeRegisteredUser = function() {
			Ember.run(function() {
				BalancedApp.__container__.lookup("controller:sessions").set("isUserRegistered", true);
			});
		};
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create,
			Adapter.delete,
			Ember.Logger.error
		);
		Ember.run(App, 'destroy');
	}
});

test('view a marketplace sets the mru cookie', function() {
	visit(Testing.MARKETPLACES_ROUTE)
		.then(function() {
			Testing.selectMarketplaceByName();
			equal(
				$.cookie(Cookies.MARKETPLACE_URI),
				'/marketplaces/' + Testing.MARKETPLACE_ID,
				'mru cookie is set'
			);
		});
});

test('view marketplace list', function() {
	visit(Testing.MARKETPLACES_ROUTE)
		.checkElements({
			"#marketplaces ul a:first": "Test Marketplace"
		});
});

test('view single marketplace', function() {
	visit(Testing.MARKETPLACES_ROUTE)
		.click('#marketplaces ul a:contains("Test Marketplace")')
		.checkElements({
			"#marketplace-name": "Test Marketplace"
		});
});

test('add test marketplace', function() {
	// Stub error logger to reduce console noise.
	sinon.stub(Ember.Logger, "error");

	this.fakeRegisteredUser();

	var spy = sinon.spy(Adapter, "create");
	Auth.set('user.api_keys_uri', '/users/%@/api_keys'.fmt(Testing.CUSTOMER_ID));

	visit(Testing.MARKETPLACES_ROUTE)
		.fillForm(".marketplace-list.test li.mp-new form", {
			name: "NEW MARKETPLACE"
		})
		.click(".marketplace-list.test li.mp-new form button")
		.then(function() {
			deepEqual(spy.args[0][0], Models.lookupFactory("api-key"));
			deepEqual(spy.args[1][0], Models.lookupFactory("marketplace"));
			deepEqual(spy.args[2][0], Models.lookupFactory("user-marketplace"));
		});
});

test('add existing marketplace', function() {
	var stub = sinon.stub(Adapter, "create");
	this.fakeRegisteredUser();
	Auth.set('user.marketplaces_uri', '/users/%@/marketplaces'.fmt(Testing.CUSTOMER_ID));

	visit(Testing.MARKETPLACES_ROUTE)
		.fillIn(".marketplace-list.production li.mp-new input[name='secret']", '1234')
		.click(".marketplace-list.production li.mp-new form button")
		.then(function() {
			ok(stub.calledOnce);
		});
});

test('delete marketplace', function() {
	var stub;
	this.fakeRegisteredUser();
	Auth.set('user.uri', '/users/xxxxxxxxxxxxxxxxxx');
	var uri;

	visit(Testing.MARKETPLACES_ROUTE)
		.click(".marketplace-list.test li:first-of-type .icon-delete")
		.then(function() {
			stub = sinon.stub(jQuery, "ajax").returns(Ember.RSVP.resolve());
			var mp = BalancedApp.__container__.lookup("controller:modals-container").get("currentModal.marketplace");
			uri = "https://auth.balancedpayments.com/users/xxxxxxxxxxxxxxxxxx/marketplaces/" + mp.get("id");
		})
		.click('#delete-marketplace [name=modal-submit]')
		.then(function() {
			var args = stub.args[0][0];
			ok(stub.calledOnce, "Delete should have been called once");
			deepEqual(args.type, "DELETE");
			deepEqual(args.url, uri);
			stub.restore();
		});
});
