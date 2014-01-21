Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({
	init: function() {
		this._super();
		var reader = Balanced.CsvReader.create();
		this.set("reader", reader);
	},

	csvRowObjects: function () {
		return this.get("reader").getObjects().map(function(object) {
			return Balanced.CsvPaymentRow.create({
				baseObject: object
			});
		});
	}.property("reader.body"),

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
