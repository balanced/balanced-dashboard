import Computed from "balanced-dashboard/utils/computed";
import Model from "./core/model";
import Utils from "balanced-dashboard/lib/utils";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";

var generateResultsLoader = function(loaderClassName, uriFieldName) {
	return function(attributes) {
		attributes = _.extend({
			path: this.get(uriFieldName)
		}, attributes);
		return BalancedApp.__container__.lookupFactory("results-loader:" + loaderClassName).create(attributes);
	};
};

var Order = Model.extend({
	uri: '/orders',
	route_name: 'orders',
	type_name: 'Order',

	buyers: Model.hasMany('buyers', 'customer'),
	seller: Model.belongsTo('merchant', 'customer'),

	credits: Model.hasMany('credits', 'credit'),
	debits: Model.hasMany('debits', 'debit'),
	reversals: Model.hasMany('reversals', 'reversal'),
	refunds: Model.hasMany('refunds', 'refund'),

	selectedTab: "charges",
	page_title: Computed.orProperties('description', 'id'),

	amount_credited: function() {
		return this.get('amount') - this.get('amount_escrowed');
	}.property('amount', 'amount_escrowed'),

	debits_amount: Computed.transform('amount', Utils.formatCurrency),
	escrow_balance: Computed.transform('amount_escrowed', Utils.formatCurrency),
	credits_amount: Computed.transform('amount_credited', Utils.formatCurrency),

	getOrderDebitsResultsLoader: function(attributes) {
		var OrderDebitsResultsLoader = require("balanced-dashboard/models/results-loaders/transactions")["default"];
		attributes = _.extend({
			resultsUri: this.get("debits_uri")
		}, attributes);
		return OrderDebitsResultsLoader.create(attributes);
	},

	getOrderCreditsResultsLoader: function(attributes) {
		var OrderCreditsResultsLoader = require("balanced-dashboard/models/results-loaders/transactions")["default"];
		attributes = _.extend({
			resultsUri: this.get("credits_uri")
		}, attributes);
		return OrderCreditsResultsLoader.create(attributes);
	},

	status: function() {
		if (this.get("isOverdue")) {
			return "overdue";
		}
		return null;
	}.property("isOverdue"),

	isOverdue: function() {
		if (this.get('amount_escrowed') === 0) {
			return false;
		}
		var firstDebit = this.get('debits_list').get('lastObject');
		if (firstDebit && moment().diff(moment(firstDebit.get('created_at')), 'days') >= 30) {
			return true;
		}
		return false;
	}.property('debits_list', 'amount_escrowed'),

	// filter credits by those that belong to the customer
	credits_list: function() {
		var customer = this.get('customer.href');
		var credits = this.get('credits') || Ember.A();

		if (!customer) {
			return credits;
		}

		credits = credits.filter(function(credit) {
			return credit.get('customer_uri') === customer;
		});

		return credits;
	}.property('credits', 'credits.@each.customer_uri', 'customer'),

	// filter debits by those that belong to the customer
	debits_list: function() {
		var customer = this.get('customer.href');
		var debits = this.get('debits') || Ember.A();

		if (!customer) {
			return debits;
		}

		debits = debits.filter(function(debit) {
			return debit.get('customer_uri') === customer;
		});

		return debits;
	}.property('debits', 'debits.@each.customer_uri', 'customer'),

	refunds_list: function() {
		var debits = this.get('debits_list');
		var refunds = Ember.A();

		debits.forEach(function(debit) {
			debit.get('refunds').then(function(refund) {
				refunds.pushObjects(refund.content);
			});
		});
		return refunds;
	}.property('debits_list', 'debits_list.@each.refunds'),

	reversals_list: function() {
		var credits = this.get('credits_list');
		var reversals = Ember.A();

		credits.forEach(function(credit) {
			credit.get('reversals').then(function(reversal) {
				reversals.pushObjects(reversal.content);
			});
		});

		return reversals;
	}.property('credits_list', 'credits_list.@each.reversals')
});

export default Order;
