import Rev1Serializer from "../serializers/rev1";
import UserMarketplace from "./user-marketplace";
import SearchModelArray from "./core/search-model-array";
import Model from "./core/model";
import Utils from "balanced-dashboard/lib/utils";
import Ajax from "balanced-dashboard/lib/ajax";
import ENV from "balanced-dashboard/config/environment";

var ORDERS_DATE = moment("2014-11-07").utc().startOf("day");

var getResultsLoader = function(loaderClassName, attributes) {
	return BalancedApp.__container__.lookupFactory("results-loader:" + loaderClassName).create(attributes);
};

var generateResultsLoader = function(loaderClassName, uriFieldName) {
	return function(attributes) {
		attributes = _.extend({
			path: this.get(uriFieldName)
		}, attributes);
		return getResultsLoader(loaderClassName, attributes);
	};
};

var Marketplace = UserMarketplace.extend({
	uri: '/marketplaces',

	getInvoicesLoader: generateResultsLoader("invoices", "invoices_uri"),
	getCustomersLoader: generateResultsLoader("customers", "customers_uri"),
	getDisputesLoader: generateResultsLoader("disputes", "disputes_uri"),
	getTransactionsLoader: generateResultsLoader("transactions", "transactions_uri"),
	getOrdersLoader: generateResultsLoader("orders", "orders_uri"),
	getFundingInstrumentsLoader: function(attributes) {
		attributes = _.extend({
			marketplace: this
		}, attributes);
		return getResultsLoader("funding-instruments", attributes);
	},
	getLogsLoader: function(attributes) {
		attributes = _.extend({}, attributes);
		return getResultsLoader("logs", attributes);
	},

	getSearchLogsLoader: function(attributes) {
		attributes = _.extend({}, attributes);
		return getResultsLoader("search-logs", attributes);
	},

	getSearchLoader: function(attributes) {
		attributes = _.extend({
			marketplace: this
		}, attributes);
		return getResultsLoader("marketplace-search", attributes);
	},

	credits: Model.hasMany('credits', 'credit'),
	debits: Model.hasMany('debits', 'debit'),
	// disputes: Model.hasMany('disputes', 'dispute'),
	refunds: Model.hasMany('refunds', 'refund'),
	holds: Model.hasMany('holds', 'hold'),
	transactions: Model.hasMany('transactions', 'transaction'),
	callbacks: Model.hasMany('callbacks', 'callback'),

	funding_instruments: Model.hasMany('funding_instruments', 'funding-instrument'),
	bank_accounts: Model.hasMany('bank_accounts', 'bank-account'),
	cards: Model.hasMany('cards', 'card'),

	owner_customer: Model.belongsTo('owner_customer', 'customer'),

	customers: Model.hasMany('customers', 'customer'),

	// TODO - take this out once marketplace has a link to invoices list
	users_uri: function() {
		return '/marketplaces/%@/users'.fmt(this.get('id'));
	}.property('id'),

	invoices_uri: '/invoices',
	disputes_uri: '/disputes',

	isMigrationStarted: Ember.computed("meta", function() {
		return this.get("meta") && !Ember.isBlank(this.get("meta")["stripe.account_id"]);
	}),

	populateWithTestTransactions: function() {
		//  pre-populate marketplace with transactions
		var id = this.get('id');
		Ajax.ajax({
			url: ENV.BALANCED.AUTH + '/marketplaces/%@/spam'.fmt(id),
			type: 'PUT'
		});
	},

	search: function(query, resultsType, params) {
		var baseUri = this.get("uri") + "/search";
		var searchParams = _.extend({
			sortField: "created_at",
			sortOrder: "desc",
			limit: 10,
			query: query
		}, params);

		var resultsUri = Utils.applyUriFilters(baseUri, searchParams);
		return SearchModelArray.newArrayLoadedFromUri(resultsUri, resultsType);
	},

	has_debitable_bank_account: Ember.computed.readOnly('owner_customer.has_debitable_bank_account'),
	has_bank_account: Ember.computed.readOnly('owner_customer.has_bank_account'),

	isOrdersRequired: function() {
		return ORDERS_DATE.isBefore(this.get("created_at"));
	}.property("created_at"),
});

Marketplace.reopenClass({
	findByApiKeySecret: function(secret) {
		return this.find("/marketplaces", {
			secret: secret
		});
	},
	findById: function(id) {
		var uri = this.constructUri(id);
		return this.find(uri);
	},
	serializer: Rev1Serializer.create(),
});

export default Marketplace;
