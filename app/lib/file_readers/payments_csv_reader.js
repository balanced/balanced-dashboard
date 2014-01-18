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

	getTotalNumberOfTransactions: function() {
		return this.getObjects().length;
	},

	executeSingleTransaction: function(object) {
		var deferred = Ember.RSVP.defer();

		var bankAccountUri = Balanced.BankAccount.constructUri(object.bank_account_id);
		Balanced.BankAccount.find(bankAccountUri).then(function(bankAccount) {
			var credit = Balanced.Credit.create();
			credit.set('destination', bankAccount);
			credit.set('amount', parseFloat(object.amount) * 100);
			credit.save().then(function() {
				deferred.resolve(credit);
			});
		});
		return deferred.promise;
	},

	save: function(callback) {
		var self = this;

		var promise = new Promise(function(resolve, reject) {
			var totalUploaded = 0;
			var recursivePromises = function(current, rest) {
				self.executeSingleTransaction(current).then(function(credit) {
					var nextObject = rest.shift();
					totalUploaded++;
					callback(totalUploaded);
					if (nextObject) {
						recursivePromises(nextObject, rest);
					} else {
						resolve();
					}
				});
			};

			var objects = self.getObjects();
			recursivePromises(objects.shift(), objects);
		});
		return promise;
	}

});
