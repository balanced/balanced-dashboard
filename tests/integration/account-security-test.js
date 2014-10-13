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
		sinonRestore(
			Auth.request,
			$.getScript
		);
		Ember.run(App, "destroy");
	},
});

test('Can enable', function() {
	var getScript = sinon.stub($, "getScript").returns(Ember.RSVP.resolve());
	Auth.get("user").set("uri", "/user");
	var confirmOtpSpy = sinon.stub(Auth, "confirmOTP")
		.returns(Ember.RSVP.resolve());
	var userSpy = sinon.stub(Auth.get("user"), "reload");
	var spy = sinon.stub(Auth, 'request');
	spy.onCall(0).returns(Ember.RSVP.resolve({
		id: "USxxxxxxxxxxxxxxx",
		secret: "VERYSECRET",
		secret_uri: "otpauth://xxxxxxxxxxxxxxxxxxxxxxx"
	}));
	spy.onCall(1).returns(Ember.RSVP.resolve({
		detail: "You need to pass in a confirm token to continue login"
	}));

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu a:contains(Enable two-factor authentication)")
		.check("#enable-auth h2", "Enable two-factor authentication")
		.fillForm("#enable-auth", {
			auth_code: "111222"
		})
		.click('#enable-auth button[name=modal-submit]')
		.then(function() {
			deepEqual(confirmOtpSpy.args, [["111222"]]);
			var args = spy.args;
			deepEqual(args, [
				[{
					url: "https://auth.balancedpayments.com/users/USeb4a5d6ca6ed11e2bea6026ba7db2987/otp",
					type: "POST"
				}]
			]);
		});
});

test('Can disable', function() {
	var spy = sinon.stub(Auth, 'request').returns(Ember.RSVP.resolve());

	Auth.set('user.otp_enabled', true);

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu a:contains(Disable two-factor authentication)")
		.checkText("#disable-auth h2", "Disable two-factor authentication")
		.click('#disable-auth button[name=modal-submit]')
		.then(function() {
			equal(spy.callCount, 1, 'Disabled');
		});
});
