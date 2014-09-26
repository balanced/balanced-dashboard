import Ember from "ember";
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';
import sinonRestore from "../helpers/sinon-restore";

import setupMarketplace from "../helpers/setup-marketplace";
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import helpers from "../helpers/helpers";

import Customer from "balanced-dashboard/models/customer";

var App, Adapter;
var context = this;

module('Integration - AddCustomer', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		setupMarketplace(App);
	},
	teardown: function() {
		sinonRestore(Adapter.create)
		Ember.run(App, 'destroy');
	}
});

test('can visit page', function() {
	visit(Testing.ADD_CUSTOMER_ROUTE).then(function() {
		equal(text("#content h1"), "Add customer");
	});
});

test('can create person customer', function() {
	var spy = sinon.spy(Adapter, "create");

	visit(Testing.ADD_CUSTOMER_ROUTE)
		.click("fieldset.application-type a.person")
		.click(".disclosure-button")
		.fillForm('#add-customer', {
			name: 'TEST',
			email: 'nick@example.com',
			'address.line1': '1234 main street',
			'address.line2': 'Ste 400',
			'address.city': 'oakland',
			'address.state': 'ca',
			'address.postal_code': '94612',
			phone: '1231231234',
			dob_month: '12',
			dob_year: '1930',
			ssn_last4: '1234',
			facebook: 'kleinsch',
			twitter: 'kleinsch'
		})
		.fillIn('#add-customer .country-select', 'US')
		.click('.actions button')
		.then(function() {
			ok(spy.calledOnce);
			equal(text('#content .page-type'), 'Customer', 'Title is not correct');
			ok(spy.calledWith(Customer, '/customers', sinon.match({
				name: 'TEST',
				applicationType: 'PERSON',
				address: {
					city: "oakland",
					country_code: "US",
					line1: "1234 main street",
					line2: "Ste 400",
					postal_code: "94612",
					state: "ca"
				},
				dob_month: "12",
				dob_year: "1930",
				email: "nick@example.com",
				facebook: "kleinsch",
				phone: "1231231234",
				ssn_last4: "1234",
				twitter: "kleinsch"
			})));
		});
});

test('can create business customer', function() {
	var spy = sinon.spy(Adapter, "create");

	visit(Testing.ADD_CUSTOMER_ROUTE)
		.click("fieldset.application-type a.business")
		.click(".disclosure-button")
		.fillForm('#add-customer', {
			business_name: 'Something Inc',
			ein: '123123123',
			name: 'TEST',
			email: 'nick@example.com',
			'address.line1': '1234 main street',
			'address.line2': 'Ste 200',
			'address.city': 'oakland',
			'address.state': 'ca',
			'address.postal_code': '94612',
			phone: '1231231234',
			dob_month: '12',
			dob_year: '1930',
			ssn_last4: '1234',
			facebook: 'kleinsch',
			twitter: 'kleinsch'
		})
		.fillIn('#add-customer .country-select', 'USA')
		.click('.actions button')
		.then(function() {
			// make sure we posted the customer
			ok(spy.calledOnce);

			// should end up on the customer page
			equal(text('#content .page-type'), 'Customer', 'Title is not correct');

			// make sure we made the correct call with the proper object
			ok(spy.calledWith(Customer, '/customers', sinon.match({
				name: "TEST",
				applicationType: "BUSINESS",
				business_name: "Something Inc",
				address: {
					city: "oakland",
					line1: "1234 main street",
					line2: "Ste 200",
					postal_code: "94612",
					state: "ca"
				},
				dob_month: "12",
				dob_year: "1930",
				ein: "123123123",
				email: "nick@example.com",
				facebook: "kleinsch",
				phone: "1231231234",
				ssn_last4: "1234",
				twitter: "kleinsch"
			})));
		});
});
