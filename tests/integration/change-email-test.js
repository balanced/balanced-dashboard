import Ember from "ember";
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';
import fixturesAdapter from "../helpers/fixtures-adapter";
import sinonRestore from "../helpers/sinon-restore";

import Testing from "../helpers/testing";
import Models from "../helpers/models";
import helpers from "../helpers/helpers";
import checkElements from "../helpers/check-elements";

var App, Auth, Adapter = fixturesAdapter;

module('Integration - ChangeEmail', {
	setup: function() {
		App = startApp({
			ADAPTER: fixturesAdapter
		});
		Auth = App.__container__.lookup("auth:main");
	},
	teardown: function() {
		sinonRestore(Auth.request, Adapter.update);
		Ember.run(App, "destroy");
	},
});

test('clicking change email from header menu brings up modal', function() {
	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-email a")
		.then(function() {
			equal($(".modal.change-email-modal.in").length, 1, 'The change email modal exists.');
			ok($(".modal.change-email-modal.in").is(":visible"), 'The change email modal is visible.');
		});
});

test('change email form submits', function() {
	var stub = sinon.stub(Adapter, "update");
	var USER_EMAIL = 'foo+1@bar.com';

	stub.callsArgWith(3, {
		"id": null,
		"admin": false,
		"email_address": USER_EMAIL
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-email a")
		.checkValue(".change-email-modal form input[name=email]", Testing.FIXTURE_USER_EMAIL, 'Email is filled in')
		.fillForm('.change-email-modal form', {
			email: USER_EMAIL,
			existing_password: '123456',
		})
		.click('button[name=modal-submit]')
		.then(function() {
			ok($(".modal.change-email-modal").is(":hidden"), 'The change email modal is hidden.');

			ok(stub.calledOnce);
			ok(stub.calledWith(Models.User, Testing.FIXTURE_USER_ROUTE, sinon.match({
				email: USER_EMAIL,
				existing_password: "123456",
			})));
		});
});

test('change email form errors if no email', function() {
	var stub = sinon.stub(Adapter, "update");

	stub.callsArgWith(3, {
		"id": null,
		"admin": false,
		"email_address": "foo+1@bar.com",
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-email a")
		.fillForm('.change-email-modal form', {
			email: '',
			existing_password: '123456'
		}, {
			click: 'button[name=modal-submit]'
		})
		.click(".change-email-modal form button[name=modal-submit]")
		.then(function() {
			ok($(".modal.change-email-modal.in").is(":visible"), 'The change email modal is still visible.');
			ok($(".modal.change-email-modal .alert-error").is(":visible"), 'The change email modal error is visible.');

			equal(stub.callCount, 0);
		});
});


test('change email errors if no existing password', function() {
	var stub = sinon.stub(Adapter, "update");
	var USER_EMAIL = 'foo+1@bar.com';

	stub.callsArgWith(3, {
		"id": null,
		"admin": false,
		"email_address": USER_EMAIL
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-email a")
		.fillForm('.change-email-modal form', {
			email: USER_EMAIL,
		}, {
			click: 'button[name=modal-submit]'
		})
		.then(function() {
			ok($(".modal.change-email-modal.in").is(":visible"), 'The change email modal is still visible.');
			ok($(".modal.change-email-modal .alert-error").is(":visible"), 'The change email modal error is visible.');

			equal(stub.callCount, 0);
		});
});
