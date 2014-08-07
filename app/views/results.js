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
		var defaultCount = 'searchResult.total_%@s'.fmt(defaultType);

		return Ember.computed(function() {
			var type = this.get('controller.type'),
				count;
			if (CONST_TYPES.indexOf(type) >= 0) {
				count = this.get('searchResult.total_%@s'.fmt(type));
			}

			if (_.isUndefined(count)) {
				count = this.get(defaultCount);
			}

			if (_.isUndefined(count)) {
				var self = this;
				count = _.reduce(CONST_TYPES, function(memo, type) {
					return memo + self.get('searchResult.total_%@s'.fmt(type));
				}, 0);
			}

			return count;
		}).property('controller.type', 'searchResult', defaultCount);
	}
};

Balanced.ResultsTableView = Balanced.View.extend({
	tagName: 'table',
	classNames: 'items',
});

Balanced.OrdersResultsView = Balanced.ResultsTableView.extend({
	classNames: 'orders',
	templateName: 'results/orders_table'
});

Balanced.TransactionsResultsView = Balanced.ResultsTableView.extend({
	classNames: 'transactions',
	templateName: 'results/transactions_table',
	colspan: 7
});

Balanced.EmbeddedTransactionsResultsView = Balanced.TransactionsResultsView.extend({
	isSmallTable: true,
	colspan: 5
});

Balanced.OrderTransactionsResultsView = Balanced.TransactionsResultsView.extend({
	templateName: 'results/order_transactions_table'
});

Balanced.CustomersResultsView = Balanced.ResultsTableView.extend({
	classNames: 'customers',
	templateName: 'results/customers_table'
});

Balanced.FundingInstrumentsResultsView = Balanced.ResultsTableView.extend({
	classNames: 'funding-instruments',
	templateName: 'results/funding_instruments_table'
});

Balanced.EmbeddedFundingInstrumentsResultsView = Balanced.FundingInstrumentsResultsView.extend({
	templateName: 'results/embedded_funding_instruments_table'
});

Balanced.DisputesResultsView = Balanced.ResultsTableView.extend({
	classNames: 'disputes',
	templateName: 'results/disputes_table',
	colspan: 6
});

Balanced.EmbeddedDisputesResultsView = Balanced.DisputesResultsView.extend({
	isSmallTable: true,
	colspan: 4
});

Balanced.LogsResultsView = Balanced.ResultsTableView.extend({
	classNames: 'logs',
	classNameBindings: 'selected',
	templateName: 'results/logs_table'
});

Balanced.LogsEmbeddedResultsView = Balanced.ResultsTableView.extend({
	classNameBindings: 'selected',
	templateName: 'results/logs_embedded_table'
});

Balanced.DateFilterHeaderView = Balanced.View.extend({
	templateName: 'results/date_filter_header',
	tagName: 'header'
});

Balanced.InvoicesResultsView = Balanced.ResultsTableView.extend({
	classNames: 'invoices',
	classNameBindings: 'selected',
	templateName: 'results/invoices_table'
});
