Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({

	needs: ["marketplace"],

	processingCompleted: false,
	processingInProgress: false,

	init: function() {
		this._super();
		var reader = Balanced.CsvReader.create();
		this.set("reader", reader);
	},

	results: Ember.computed.mapBy("creditCreators", "credit"),

	creditCreators: function() {
		this.set("processingCompleted", false);
		this.set("processingInProgress", false);
		return this.get("reader").getObjects().map(function(object, i) {
			return Balanced.CreditCreator.fromCsvRow(object);
		});
	}.property("reader.body"),

	actions: {
		submit: function() {
			var self = this;
			self.set("processingInProgress", true);
			var creators = this.get("creditCreators").slice();

			var r = function(creator, rest) {
				creator.save().then(function() {
					if (rest.length) {
						r(rest.shift(), rest);
					} else {
						self.set("processingInProgress", false);
						self.set("processingCompleted", true);
					}
				});
			};
			r(creators.shift(), creators);
		}
	}
});
