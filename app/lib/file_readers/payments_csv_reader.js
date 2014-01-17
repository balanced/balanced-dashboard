Balanced.PaymentsCsvReader = Balanced.CsvReader.extend({

	mapRowsToCredit: function(mapping) {
		var mappedRows = this.mapColumnsToCreditAttributes(mapping);
		return mappedRows.map(function(row) {
			return Balanced.Credit.create(row);
		});
	},

	createCredits: function () {
		var createCredit = function(bankAccount) {
			var credit = Balanced.Credit.create();
			credit.set('destination', bankAccount);
			credit.set('amount', amount);
			credit.save();
		};

		// Skip the first, since it's the header
		for (var i = 1; i < objects.length; i++) {
			var obj = objects[i];
			var bankAccountId = obj[1];
			var amount = Balanced.Utils.dollarsToCents(obj[2]);
			Balanced.BankAccount.find(Balanced.BankAccount.constructUri(bankAccountId)).then(createCredit);
		}
	}

});
