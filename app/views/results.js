var Computed = {
	isTypeSelected: function(type) {
		return Ember.computed.equal('controller.type', type);
	},
	isCategorySelected: function(category) {
		return Ember.computed.equal('controller.category', category);
	},
	label: function(type, label, prop) {
		prop = prop || 'transactionStatus';

		return function() {
			if (this.get('controller.type') === type) {
				return label + ': %@'.fmt(Balanced.Utils.toTitleCase(this.get('controller.' + prop)));
			} else {
				return label + ': All';
			}
		}.property('controller.' + prop, 'controller.type');
	},
	typeTotals: function(CONST_TYPES, defaultType) {
		var defaultCount = Ember.String.fmt('searchResult.total_%@s', defaultType);

		return Ember.computed(function() {
			var type = this.get('controller.type');
			return (CONST_TYPES.indexOf(type) >= 0 && this.get('searchResult.total_%@s'.fmt(type))) || this.get(defaultCount);
		}).property('controller.type', 'searchResult')
	}
};

Balanced.ResultsFiltersHeaderView = Balanced.View.extend({
	templateName: 'results/results_filters_header',
	tagName: 'header',
	from: 'activity',

	// UI computed properties
	transactionsTabSelected: function() {
		return ['search', 'transaction'].indexOf(this.get('controller.category')) >= 0;
	}.property('controller.category'),
	customersTabSelected: Computed.isCategorySelected('customer'),
	ordersTabSelected: Computed.isCategorySelected('order'),
	fundingInstrumentsTabSelected: Computed.isCategorySelected('funding_instrument'),
	disputesTabSelected: Computed.isCategorySelected('dispute'),

	isSearch: Ember.computed.equal('from', 'search'),
	isActivity: Ember.computed.equal('from', 'activity'),

	transaction_type_label: function() {
		var typesToLabels = {
			DEFAULT: 'Transactions',
			card_hold: 'Holds'
		};

		var types = Balanced.SEARCH.SEARCH_TYPES;

		if (this.get('isActivity')) {
			types = Balanced.SEARCH.TRANSACTION_TYPES;
		}

		var label = this._getLabel(typesToLabels, types, this.get('controller.type'));
		var status = this.get('controller.transactionStatus');
		if (!status || status === 'all') {
			return label;
		}

		return label + ': %@'.fmt(Balanced.Utils.toTitleCase(status));
	}.property('controller.type', 'controller.transactionStatus'),

	funding_instrument_type_label: function() {
		var typesToLabels = {
			DEFAULT: 'Cards & Bank Accounts'
		};

		var types = Balanced.SEARCH.FUNDING_INSTRUMENT_TYPES;
		return this._getLabel(typesToLabels, types, this.get('controller.type'));
	}.property('controller.type'),

	dispute_type_label: function() {
		var typesToLabels = {
			DEFAULT: 'Disputes'
		};

		var types = Balanced.SEARCH.DISPUTE_TYPES;
		return this._getLabel(typesToLabels, types, this.get('controller.type'));
	}.property('controller.type'),

	_getLabel: function(labelMapping, acceptedTypes, type) {
		var label = labelMapping[type];
		if (!label && acceptedTypes.indexOf(type) > -1) {
			label = Balanced.Utils.toTitleCase(type.replace('_', ' ')) + 's';
		}

		return (label) ? label : labelMapping.DEFAULT;
	},

	show_download_button: Ember.computed.alias('transactionsTabSelected'),
	show_disputes_download_button: Ember.computed.alias('disputesTabSelected')
});

Balanced.ResultsFiltersHeaderWithCountsView = Balanced.ResultsFiltersHeaderView.extend({
	templateName: 'results/results_filters_header_with_counts',

	totalOrdersTabHeader: Balanced.computed.fmt('searchResult.total_orders', 'Orders (%@)'),
	totalTransactionsHeader: Balanced.computed.fmt('searchResult.total_transactions', 'Transactions (%@)'),
	totalCustomersTabHeader: Balanced.computed.fmt('searchResult.total_customers', 'Customers (%@)'),
	totalFundingInstrumentsHeader: Balanced.computed.fmt('searchResult.total_funding_instruments', 'Cards & Bank Accounts (%@)'),
	totalDisputesHeader: Balanced.computed.fmt('searchResult.total_disputes', 'Disputes (%@)'),

	transaction_type_total: Computed.typeTotals(Balanced.SEARCH.SEARCH_TYPES, 'transaction'),
	funding_instrument_type_total: Computed.typeTotals(Balanced.SEARCH.FUNDING_INSTRUMENT_TYPES, 'funding_instrument'),
	dispute_type_total: Computed.typeTotals(Balanced.SEARCH.DISPUTE_TYPES, 'dispute')
});

Balanced.TransactionsFiltersHeaderView = Balanced.View.extend({
	templateName: 'results/transactions_filters_header',
	tagName: 'header',

	allTabSelected: Computed.isTypeSelected("transaction"),
	holdsTabSelected: Computed.isTypeSelected("card_hold"),
	creditsTabSelected: Computed.isTypeSelected("credit"),
	failedCreditsTabSelected: Computed.isTypeSelected("failed_credit"),
	reversalsTabSelected: Computed.isTypeSelected("reversal"),
	debitBankAccountsTabSelected: Computed.isTypeSelected("bank_account_debit"),
	debitCardsTabSelected: Computed.isTypeSelected("card_debit"),

	debitsTabSelected: Computed.isTypeSelected("debit"),
	refundsTabSelected: Computed.isTypeSelected("refund"),
	disputesTabSelected: Computed.isTypeSelected("dispute"),

	debitsTabSelected: Computed.isTypeSelected('debit'),
	refundsTabSelected: Computed.isTypeSelected('refund'),
	disputesTabSelected: Computed.isTypeSelected('dispute'),

	// debits_label: Computed.label('debit', 'Debits', 'transactionType'),
	debits_label: Computed.label('debit', 'Debits'),
	credits_label: Computed.label('credit', 'Credits')
});

Balanced.ResultsSortableColumnHeaderView = Balanced.View.extend({
	tagName: 'th',
	classNameBindings: 'sortClass',

	sortClass: function() {
		var SORTS = {
			asc: 'ascending',
			desc: 'descending'
		};

		var sortField = this.get('controller.sortField');
		var sortOrder = this.get('controller.sortOrder');
		if (sortField !== this.get('field')) {
			return 'unsorted';
		} else {
			return SORTS[sortOrder] || 'unsorted';
		}
	}.property('controller.sortField', 'controller.sortOrder'),

	click: function(e) {
		var sortField = this.get('controller.sortField');
		var sortOrder = this.get('controller.sortOrder');
		var allowSortByNone = this.get('controller.allowSortByNone');
		var nextSortOrder = 'desc';

		if (sortField === this.get('field')) {
			switch (sortOrder) {
				case 'asc':
					nextSortOrder = 'desc';
					break;
				case 'desc':
					nextSortOrder = 'asc';
					if (allowSortByNone) {
						nextSortOrder = 'none';
					}
					break;
			}
		}

		this.get('controller').send('changeSortOrder', this.get('field'), nextSortOrder);
	}
});

Balanced.ResultsTableView = Balanced.View.extend({
	tagName: 'table',
	classNames: 'items'
});

Balanced.OrdersResultsView = Balanced.ResultsTableView.extend({
	classNames: 'orders',
	templateName: 'results/orders_table'
});

Balanced.TransactionsResultsView = Balanced.ResultsTableView.extend({
	classNames: 'transactions',
	templateName: 'results/transactions_table'
});

Balanced.CustomersResultsView = Balanced.ResultsTableView.extend({
	classNames: 'customers',
	templateName: 'results/customers_table'
});

Balanced.FundingInstrumentsResultsView = Balanced.ResultsTableView.extend({
	classNames: 'funding-instruments',
	templateName: 'results/funding_instruments_table'
});

Balanced.DisputesResultsView = Balanced.ResultsTableView.extend({
	classNames: 'disputes',
	templateName: 'results/disputes_table'
});

Balanced.LogsResultsView = Balanced.ResultsTableView.extend({
	classNames: 'logs',
	classNameBindings: 'selected',
	templateName: 'results/logs_table'
});

Balanced.LogsFiltersHeaderView = Balanced.View.extend({
	templateName: 'results/logs_filters_header',
	tagName: 'header'
});

Balanced.InvoicesResultsView = Balanced.ResultsTableView.extend({
	classNames: 'invoices',
	classNameBindings: 'selected',
	templateName: 'results/invoices_table'
});
