Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({
	needs: ["marketplace"],

	process: function(csvPaymentRows) {
		var self = this;
		var batch = Balanced.BatchProcessor.create({
			collection: csvPaymentRows
		});
		return batch
			.parallel(2)
			.each(function(index, paymentRow, done) {
				paymentRow
					.process()
					.then(function(result) {
						done(result);
					}, function(result) {
						done(result);
					});
			})
			.end();
	},

	actions: {}
});
