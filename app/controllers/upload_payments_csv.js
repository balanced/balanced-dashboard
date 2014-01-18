Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({
	needs: ["marketplace"],
	content: null,

	expected_column_fields: function() {
		return this.get("payments_csv_reader").expected_columns;
	}.property("payments_csv_reader"),

	upload_error_messages: ["No file provided"],

	addStep: function(stepView) {
		this.steps = this.steps || [];
		this.steps.push(stepView);
		if (this.steps.length === 1) {
			stepView.show();
			this.current_index = 0;
		} else {
			stepView.hide();
		}
		return this;
	},

	nextStep: function() {
		this.current_index++;
		this.refreshViews();
	},

	prevStep: function() {
		this.current_index--;
		this.refreshViews();
	},

	refreshViews: function() {
		var self = this;
		this.steps.forEach(function(stepView, i) {
			stepView.toggle(self.current_index === i);
		});
	},

	current_escrow_balance: 100,

	// End of step 1
	setPaymentsReader: function(reader) {
		this.set("reader", reader);
		this.nextStep();
	},

	// End of step 2
	setColumnsMapping: function(mapping) {
		this.nextStep();
	},

	// End of step 3
	setStartProcessing: function() {
		var self = this;
		var paymentsCsvReader = this.get("reader");
		var batch = Balanced.BatchProcessor.create({
			collection: paymentsCsvReader.getObjects()
		});

		self.set("results", batch.results);
		this.set("batch", batch);
		this.process(batch).then(function() {
			// Display Message
		});
		this.nextStep();
	},

	process: function(batch, eachCallback) {
		var deferred = Ember.RSVP.defer();

		batch
			.parallel(2)
			.each(function(index, row, done) {
				var bankAccountUri = Balanced.BankAccount.constructUri(row.bank_account_id);
				Balanced.BankAccount.find(bankAccountUri).then(function(bankAccount) {
					var credit = Balanced.Credit.create();
					credit.set('destination', bankAccount);
					credit.set("appears_on_statement_as", row.bank_statement_descriptor);
					credit.set("description", row.internal_description);
					credit.set('amount', parseFloat(row.amount) * 100);
					credit.save().then(function() {
						var result = {
							bank_account: bankAccount,
							credit: credit
						};
						if (eachCallback) {
							eachCallback(result);
						}
						done(result);
					});
				});
			})
			.end(function(results) {
				deferred.resolve(results);
			});
		return deferred.promise;
	},

	actions: {
		nextStep: function() {
			this.nextStep();
		},
		prevStep: function() {
			this.prevStep();
		}

	}
});
