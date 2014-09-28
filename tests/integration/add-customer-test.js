import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import helpers from "../helpers/helpers";

import Customer from "balanced-dashboard/models/customer";

var App, Adapter;

module('Integration - AddCustomer', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create
		);
		Ember.run(App, 'destroy');
	}
});

test('can visit page', function() {
	visit(Testing.ADD_CUSTOMER_ROUTE)
		.checkText("#content h1", "Add customer");
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
		.checkText("#content .page-type", "Customer")
		.then(function() {
			ok(spy.calledOnce);
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
		.checkText("#content .page-type", "Customer")
		.then(function() {
			// make sure we posted the customer
			ok(spy.calledOnce);

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
