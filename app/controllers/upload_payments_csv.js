Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({
	needs: ["marketplace"],

	current_index: 0,

	addStep: function(stepView) {
		this.steps = this.steps || [];
		this.steps.push(stepView);
		this.refreshViews();
		return this;
	},

	nextStep: function() {
		if (this.current_index < this.steps.length) {
			this.set("current_index", this.current_index + 1);
		}
		this.refreshViews();
	},

	prevStep: function() {
		if (this.current_index > 0) {
			this.set("current_index", this.current_index - 1);
		}
		this.refreshViews();
	},

	refreshViews: function() {
		var self = this;
		this.steps.forEach(function(stepView, i) {
			stepView.toggle(self.current_index === i);
		});
	},

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
	startProcessing: function(reader) {
		var self = this;
		var batch = Balanced.BatchProcessor.create({
			collection: reader.getObjects()
		});

		self.set("results", batch.results);
		self.set("credits", []);

		this.set("batch", batch);
		this.process(batch, function(result) {
			self.credits.pushObject(result.credit);
		}).then(function() {
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
					credit.setProperties({
						destination: bankAccount,
						appears_on_statement_as: row.bank_statement_descriptor,
						description: row.internal_description,
						amount: parseFloat(row.amount) * 100
					});
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
