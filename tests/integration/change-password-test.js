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

var openChangePasswordModal = function() {
	return visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu a:contains(Change password)");
};

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
	openChangePasswordModal()
		.check("#change-password-modal", 1);
});

test('change password form submits', function() {
	var stub = sinon.stub(Adapter, "update");

	stub.callsArgWith(3, {
		"id": null,
		"admin": false
	});

	openChangePasswordModal()
		.fillForm('#change-password-modal form', {
			existing_password: '123456',
			password: '12345678',
			confirm_password: '12345678'
		})
		.click('#change-password-modal button[name=modal-submit]')
		.then(function() {
			var args = stub.args[0];
			ok(stub.calledOnce);
			equal(args[0], Models.lookupFactory("user"));
			equal(args[1], Testing.FIXTURE_USER_ROUTE);
			matchesProperties(args[2], {
				confirm_password: "12345678",
				existing_password: "123456",
				password: "12345678"
			});
		});
});

test('change password errors if no existing password', function() {
	var stub = sinon.stub(Adapter, "update");

	stub.callsArgWith(3, {
		"id": null,
		"admin": false
	});

	openChangePasswordModal()
		.fillForm('#change-password-modal form', {
			password: '12345678',
			confirm_password: '1234567'
		}, {
			click: 'button[name=modal-submit]'
		})
		.checkElements({
			"#change-password-modal": 1,
			"#change-password-modal .form-group:eq(0) .alert-error": "can't be blank",
			"#change-password-modal .form-group:eq(1) .alert-error": "",
			"#change-password-modal .form-group:eq(2) .alert-error": "must match password",
		})
		.then(function() {
			equal(stub.callCount, 0);
		});
});
