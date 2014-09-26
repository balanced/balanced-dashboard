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

module('Integration - ChangePassword', {
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

test('clicking change password from header menu brings up modal', function() {
	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-password a")
		.then(function() {
			equal($(".modal.change-password-modal.in").length, 1, 'The change password modal exists.');
			ok($(".modal.change-password-modal.in").is(":visible"), 'The change password modal is visible.');
		});
});

test('change password form submits', function() {
	var stub = sinon.stub(Adapter, "update");

	stub.callsArgWith(3, {
		"id": null,
		"admin": false
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-password a")
		.fillForm('.change-password-modal form', {
			existing_password: '123456',
			password: '12345678',
			confirm_password: '12345678'
		})
		.click('button[name=modal-submit]')
		.then(function() {
			ok($(".modal.change-password-modal").is(":hidden"), 'The change password modal is hidden.');

			ok(stub.calledOnce);
			ok(stub.calledWith(Models.User, Testing.FIXTURE_USER_ROUTE, sinon.match({
				confirm_password: "12345678",
				existing_password: "123456",
				password: "12345678"
			})));
		});
});

test('change password errors if no existing password', function() {
	var stub = sinon.stub(Adapter, "update");

	stub.callsArgWith(3, {
		"id": null,
		"admin": false
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-password a")
		.fillForm('.change-password-modal form', {
			password: '12345678',
			confirm_password: '12345678'
		}, {
			click: 'button[name=modal-submit]'
		})
		.then(function() {
			ok($(".modal.change-password-modal.in").is(":visible"), 'The change password modal is still visible.');
			ok($(".modal.change-password-modal .alert-error").is(":visible"), 'The change password modal error is visible.');

			equal(stub.callCount, 0);
		});
});

test('change password errors if passwords are different', function() {
	var stub = sinon.stub(Adapter, "update");

	stub.callsArgWith(3, {
		"id": null,
		"admin": false
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-password a")
		.fillForm('.change-password-modal form', {
			existing_password: '123456',
			password: '12345678',
			confirm_password: '666666'
		}, {
			click: 'button[name=modal-submit]'
		})
		.then(function() {
			ok($(".modal.change-password-modal.in").is(":visible"), 'The change password modal is still visible.');
			ok($(".modal.change-password-modal .alert-error").is(":visible"), 'The change password modal error is visible.');

			equal(stub.callCount, 0);
		});
});
