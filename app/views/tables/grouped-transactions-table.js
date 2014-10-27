import Ember from "ember";

var GroupedTransactionsTableView = Ember.View.extend({
	layoutName: 'tables/grouped-transactions-table-layout',
	tagName: 'table',
	classNames: ["items", "grouped-transactions"],
});

export default GroupedTransactionsTableView;
