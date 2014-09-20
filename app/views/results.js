import Ember from "ember";
import ResultsTableView from "./results/results-table";

Balanced.InvoiceTransactionsResultsView = ResultsTableView.extend({
	templateName: "results/invoice_transactions_table"
});

Balanced.OrderTransactionsResultsView = Balanced.TransactionsResultsView.extend({
	templateName: 'results/order_transactions_table'
});

Balanced.CustomersResultsView = ResultsTableView.extend({
	classNames: 'customers',
	templateName: 'results/customers_table'
});

Balanced.FundingInstrumentsResultsView = ResultsTableView.extend({
	classNames: 'funding-instruments',
	templateName: 'results/funding_instruments_table'
});

Balanced.EmbeddedFundingInstrumentsResultsView = Balanced.FundingInstrumentsResultsView.extend({
	templateName: 'results/embedded_funding_instruments_table'
});

Balanced.DisputesResultsView = ResultsTableView.extend({
	classNames: 'disputes',
	templateName: 'results/disputes_table',
	colspan: 6
});

Balanced.EmbeddedDisputesResultsView = Balanced.DisputesResultsView.extend({
	isSmallTable: true,
	colspan: 5
});

Balanced.LogsResultsView = ResultsTableView.extend({
	classNames: 'logs',
	classNameBindings: 'selected',
	templateName: 'results/logs_table'
});

Balanced.LogsEmbeddedResultsView = ResultsTableView.extend({
	classNameBindings: 'selected',
	templateName: 'results/logs_embedded_table'
});

Balanced.InvoicesResultsView = ResultsTableView.extend({
	classNames: 'invoices',
	classNameBindings: 'selected',
	templateName: 'results/invoices_table'
});
