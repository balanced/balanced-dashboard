import startApp from '../helpers/start-app';
import fixturesAdapter from "../helpers/fixtures-adapter";
import sinonRestore from "../helpers/sinon-restore";
import Testing from "../helpers/testing";

import helpers from "../helpers/helpers";
import checkElements from "../helpers/check-elements";

var App, Auth;

module('Integration - Account Security', {
	setup: function() {
		App = startApp({
			ADAPTER: fixturesAdapter
		});
		Auth = App.__container__.lookup("auth:main");
	},
	teardown: function() {
		sinonRestore(Auth.request);
		Ember.run(App, "destroy");
	},
});

test('Can enable', function() {
	var spy = sinon.stub(Auth, 'request')
		.returns(Ember.RSVP.resolve({
			id: "USxxxxxxxxxxxxxxx",
			secret: "VERYSECRET",
			secret_uri: "otpauth://xxxxxxxxxxxxxxxxxxxxxxx"
		}));

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .enable-auth a")
		.checkText("#enable-auth h2", "Enable two-factor authentication")
		.click('#enable-auth button[name=modal-submit]')
		.then(function() {
			equal(spy.callCount, 1, 'Enabled');
		});
});

test('Can disable', function() {
	var spy = sinon.stub(Auth, 'request').returns(Ember.RSVP.resolve());

	Auth.set('user.otp_enabled', true);

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .disable-auth a")
		.checkText("#disable-auth h2", "Disable two-factor authentication")
		.click('#enable-auth button[name=modal-submit]')
		.then(function() {
			equal(spy.callCount, 1, 'Disabled');
		});
});
