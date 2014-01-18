Balanced.PaymentsCsvReader = Balanced.CsvReader.extend({

	expected_columns: [
		"customer_id", "bank_account_id", "amount", "bank_statement_descriptor", "internal_description"
	],

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

	save: function(callback) {
		var totalUploaded = 0;
		this.getObjects().forEach(function(obj) {
			var bankAccountUri = Balanced.BankAccount.constructUri(obj.bank_account_id);
			Balanced.BankAccount.find(bankAccountUri).then(function(bankAccount) {
				var credit = Balanced.Credit.create();
				credit.set('destination', bankAccount);
				credit.set('amount', parseFloat(obj.amount) * 100);
				credit.save().then(function() {
					totalUploaded++;
					callback(totalUploaded);
				});
			});
		});
	}

});
