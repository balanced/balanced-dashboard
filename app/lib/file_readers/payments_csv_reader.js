Balanced.PaymentsCsvReader = Balanced.CsvReader.extend({

	totalPayoutBalance: function () {
		var total = 0;
		this.get("hashes").forEach(function (hash) {
			total += parseFloat(hash.amount);
		});
		return total * 100;
	},

	totalNumberOfCustomers: function () {
		return this.get("hashes").length;
	}

});
