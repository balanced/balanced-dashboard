Balanced.PaymentsCsvReader = Balanced.CsvReader.extend({

	expected_columns: [
		"customer_id", "bank_account_id", "amount", "bank_statement_descriptor", "internal_description"
	],

	valid_columns: function() {
		return this.columnsMatch(this.expected_columns);
	}.property("column_names"),

	totalPayoutBalance: function() {
		var total = 0;
		this.getObjects().forEach(function(hash) {
			total += parseFloat(hash.amount);
		});
		return total * 100;
	},

	totalNumberOfCustomers: function() {
		return this.getObjects().mapBy("customer_id").uniq().length;
	},

	getTotalNumberOfTransactions: function() {
		return this.getObjects().length;
	}

});
