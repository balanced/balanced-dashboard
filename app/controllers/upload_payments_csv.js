Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({

	needs: ["marketplace"],

	init: function() {
		this._super();
		var reader = Balanced.CsvReader.create();
		this.set("reader", reader);
	},

	results: Ember.computed.mapBy("creditCreators", "credit"),

	creditCreators: function() {
		return this.get("reader").getObjects().map(function(object, i) {
			return Balanced.CreditCreator.fromCsvRow(object);
		});
	}.property("reader.body"),

	actions: {
		submit: function() {
			Balanced.BatchProcessor.create()
				.parallel(4)
				.each(this.get("creditCreators"), function(index, creditCreator, done) {
					return creditCreator.save().then(done, done);
				})
				.end();
		}
	}
});
