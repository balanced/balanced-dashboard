import { CountryCodesToNames } from "balanced-dashboard/lib/country-codes";
import Model from "./core/model";
import Computed from "balanced-dashboard/utils/computed";
import FundingInstrumentsResultsLoader from "./results-loaders/funding-instruments";
import TransactionsResultsLoader from "./results-loaders/transactions";

var CUSTOMER_TYPES = {
	BUSINESS: 'Business',
	PERSON: 'Person'
};

var Customer = Model.extend(Ember.Validations, {
	bank_accounts: Model.hasMany('bank_accounts', 'bank-account'),
	cards: Model.hasMany('cards', 'card'),
	transactions: Model.hasMany('transactions', 'transaction'),
	debits: Model.hasMany('debits', 'debit'),
	credits: Model.hasMany('credits', 'credit'),
	holds: Model.hasMany('holds', 'hold'),
	refunds: Model.hasMany('refunds', 'refund'),
	orders: Model.hasMany('orders', 'order'),
	disputes: Model.hasMany('disputes', 'dispute'),

	uri: '/customers',
	route_name: 'customer',
	type_name: 'Customer',

	has_bank_account: Ember.computed.and('bank_accounts.isLoaded', 'bank_accounts.length'),

	orders_list: function() {
		var customer_uri = this.get('href');
		var orders = this.get('orders') || Ember.A();

		if (customer_uri) {
			orders = orders.filter(function(order) {
				return order.get('merchant_uri') === customer_uri;
			});
		}
		return orders;
	}.property('orders', 'orders.@each.merchant_uri'),

	debitable_bank_accounts: function() {
		return this.get('bank_accounts').filterBy('can_debit');
	}.property('bank_accounts.@each.can_debit'),

	creditable_cards: function() {
		return this.get('cards').filterBy("can_credit");
	}.property('cards'),

	has_debitable_bank_account: function() {
		return this.get('bank_accounts').isAny('can_debit');
	}.property('bank_accounts.@each.can_debit'),

	funding_instruments: Ember.computed.union('bank_accounts', 'cards'),
	debitable_funding_instruments: Ember.computed.union('debitable_bank_accounts', 'cards'),
	creditable_funding_instruments: Ember.computed.union('bank_accounts', 'creditable_cards'),

	getFundingInstrumentsLoader: function(attributes) {
		attributes = _.extend({
			path: this.get("uri") + "/search"
		}, attributes);
		return FundingInstrumentsResultsLoader.create(attributes);
	},
	getDisputesLoader: function(attributes) {
		var DisputesResultsLoader = require("balanced-dashboard/models/results-loaders/disputes")["default"];
		attributes = _.extend({
			path: this.get("disputes_uri"),
		}, attributes);
		return DisputesResultsLoader.create(attributes);
	},
	getTransactionsLoader: function(attributes) {
		attributes = _.extend({
			path: this.get("transactions_uri"),
		}, attributes);
		return TransactionsResultsLoader.create(attributes);
	},

	type: function() {
		return (this.get('ein') || this.get('business_name')) ? CUSTOMER_TYPES.BUSINESS : CUSTOMER_TYPES.PERSON;
	}.property('ein', 'business_name'),

	is_business: Ember.computed.equal('type', CUSTOMER_TYPES.BUSINESS),
	is_person: Ember.computed.equal('type', CUSTOMER_TYPES.PERSON),
	display_me: Computed.orProperties('name', 'id'),

	display_me_with_email: function() {
		var name = this.get('display_me');
		var email = this.get('email');

		if (email) {
			return "%@ (%@)".fmt(name, email);
		} else {
			return name;
		}
	}.property('display_me', 'email'),

	page_title: Ember.computed.readOnly('displayName'),

	facebook_id: Computed.orProperties('facebook', 'meta.facebook'),
	twitter_id: Computed.orProperties('twitter', 'meta.twitter'),

	facebook_url: function() {
		if (this.get('facebook_id')) {
			return 'http://facebook.com/' + this.get('facebook_id');
		} else {
			return undefined;
		}
	}.property('facebook_id'),

	twitter_url: function() {
		if (this.get('twitter_id')) {
			return 'http://twitter.com/' + this.get('twitter_id');
		} else {
			return undefined;
		}
	}.property('twitter_id'),

	displayName: function() {
		var name;
		if (this.get('is_business')) {
			name = this.get('business_name');
		} else {
			name = this.get('name');
		}
		var email = this.get('email');
		if (name) {
			if (email) {
				name += ' (%@)'.fmt(email);
			}
		} else {
			name = email;
		}
		return name;
	}.property('is_business', 'business_name', 'name', 'email'),

	country_name: function() {
		return CountryCodesToNames[this.get('address.country_code')];
	}.property('address.country_code'),

	address_string: function() {
		var seperator = ', ';
		var addressParts = [];
		var city = this.get('address.city');
		var cityLine = '';

		addressParts.push(this.get('address.line1'));
		addressParts.push(this.get('address.line2'));

		cityLine = (city ? city + ', ' : '') + ' ' + (this.get('address.postal_code') || '');
		addressParts.push($.trim(cityLine));
		addressParts.push(this.get('address.country_code'));

		addressParts = _.compact(addressParts);
		return addressParts.join(seperator);
	}.property('address.line1', 'address.line2', 'address.city', 'address.state', 'address.postal_code', 'address.country_code'),

	dob: function() {
		var month = this.get('dob_month');
		var year = this.get('dob_year');

		if (month && year) {
			return "%@-%@".fmt(year, month);
		} else {
			return year;
		}
	}.property('dob_month', 'dob_year'),

	dob_error: Computed.orProperties('validationErrors.dob_month', 'validationErrors.dob_year'),
	is_identity_verified: Ember.computed.equal('merchant_status', 'underwritten'),

	status: function() {
		return this.get('is_identity_verified') ? 'verified' : 'unverified';
	}.property('is_identity_verified')
});

Customer.reopenClass({
	findByNameOrEmail: function(marketplace, query) {
		return marketplace.search(query, "customer", {
			type: "customer"
		});
	}
});

export default Customer;
