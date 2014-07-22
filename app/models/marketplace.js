require('app/models/user_marketplace');
require("./results_loaders/*");

var generateResultsLoader = function(klass, uriFieldName) {
	return function(attributes) {
		attributes = _.extend({
			path: this.get(uriFieldName)
		}, attributes);
		return klass.create(attributes);
	};
};

Balanced.Marketplace = Balanced.UserMarketplace.extend({
	uri: '/marketplaces',

	getCustomersLoader: generateResultsLoader(Balanced.CustomersResultsLoader, "customers_uri"),
	getDisputesLoader: generateResultsLoader(Balanced.DisputesResultsLoader, "disputes_uri"),
	getTransactionsLoader: generateResultsLoader(Balanced.TransactionsResultsLoader, "transactions_uri"),
	getFundingInstrumentsLoader: function(attributes) {
		attributes = _.extend({
			marketplace: this
		}, attributes);
		return Balanced.FundingInstrumentsResultsLoader.create(attributes);
	},
	getLogsLoader: function(attributes) {
		attributes = _.extend({}, attributes);
		return Balanced.LogsResultsLoader.create(attributes);
	},
	getOrdersLoader: function(attributes) {
		attributes = _.extend({}, attributes);
		return Balanced.OrdersResultsLoader.create(attributes);
	},

	credits: Balanced.Model.hasMany('credits', 'Balanced.Credit'),
	debits: Balanced.Model.hasMany('debits', 'Balanced.Debit'),
	// disputes: Balanced.Model.hasMany('disputes', 'Balanced.Dispute'),
	refunds: Balanced.Model.hasMany('refunds', 'Balanced.Refund'),
	holds: Balanced.Model.hasMany('holds', 'Balanced.Hold'),
	transactions: Balanced.Model.hasMany('transactions', 'Balanced.Transaction'),
	callbacks: Balanced.Model.hasMany('callbacks', 'Balanced.Callback'),

	funding_instruments: Balanced.Model.hasMany('funding_instruments', 'Balanced.FundingInstrument'),
	bank_accounts: Balanced.Model.hasMany('bank_accounts', 'Balanced.BankAccount'),
	cards: Balanced.Model.hasMany('cards', 'Balanced.Card'),

	owner_customer: Balanced.Model.belongsTo('owner_customer', 'Balanced.Customer'),

	customers: Balanced.Model.hasMany('customers', 'Balanced.Customer'),

	// TODO - take this out once marketplace has a link to invoices list
	users_uri: function() {
		return '/marketplaces/%@/users'.fmt(this.get('id'));
	}.property('id'),

	invoices_uri: '/invoices',
	disputes_uri: '/disputes',

	populateWithTestTransactions: function() {
		//  pre-populate marketplace with transactions
		var id = this.get('id');
		Balanced.NET.ajax({
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

		var resultsUri = Balanced.Utils.applyUriFilters(baseUri, searchParams);
		return Balanced.SearchModelArray.newArrayLoadedFromUri(resultsUri, resultsType);
	},

	has_debitable_bank_account: Ember.computed.readOnly('owner_customer.has_debitable_bank_account'),
	has_bank_account: Ember.computed.readOnly('owner_customer.has_bank_account')
});

Balanced.TypeMappings.addTypeMapping('marketplace', 'Balanced.Marketplace');

Balanced.Marketplace.reopenClass({
	findById: function(id) {
		var uri = this.constructUri(id);
		return this.find(uri);
	},
	serializer: Balanced.Rev1Serializer.create(),
}, {
	COMPANY_TYPES: [{
		value: "llc",
		label: "LLC"
	}, {
		value: "s-corp",
		label: "S-Corp"
	}, {
		value: "c-corp",
		label: "C-Corp"
	}, {
		value: "partnership",
		label: "Partnership"
	}, {
		value: "sole-proprietorship",
		label: "Sole Proprietorship"
	}]
});
