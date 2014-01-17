Balanced.PaymentsCsvReader = Balanced.CsvReader.extend({

	totalPayoutBalance: function () {
		var total = 0;
		this.getObjects().forEach(function (hash) {
			total += parseFloat(hash.amount);
		});
		return total * 100;
	},

	totalNumberOfCustomers: function () {
		return this.getObjects().mapBy("customer_id").uniq().length;
	}

});
