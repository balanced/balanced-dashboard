import TransactionsTableView from "./transactions-table";

var OrderTransactionsTableView = TransactionsTableView.extend({
	templateName: 'results/order-transactions-table',
	classNames: 'non-interactive',

	customersArray: function() {
		var customers = this.get("customers");
		if (!Ember.isArray(customers)) {
			return [customers];
		}
		return customers;
	}.property("customers"),

	groupedResults: function() {
		var customers = this.get("customersArray");
		var results = this.get("loader.results");
		var groupedTransactions = [];

		results.forEach(function(transactions) {
			var buyer = customers.findBy("uri", transactions.get('customer_uri'));
			var customer = groupedTransactions.findBy('customer_uri', transactions.get('customer_uri'));

			if(!customer) {
				customer = Ember.Object.create({
					customer_uri: transactions.get('customer_uri'),
					customer: buyer,
					transactions: []
				});
				groupedTransactions.pushObject(customer);
			}

			customer.get('transactions').pushObject(transactions);
		});

		return groupedTransactions;
	}.property("customersArray", "loader.results.length"),
});

export default OrderTransactionsTableView;
