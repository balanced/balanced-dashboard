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

Balanced.InvoiceTransactionsResultsView = Balanced.ResultsTableView.extend({
	templateName: "results/invoice_transactions_table"
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
	colspan: 5
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
