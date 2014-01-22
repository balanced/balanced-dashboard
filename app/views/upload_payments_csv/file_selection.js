Balanced.MarketplaceUploadPaymentsCsvView = Balanced.View.extend({

	payoutTotal: function() {
		var total = 0;
		this.get("controller.results").forEach(function(credit) {
			if (credit.amount) {
				total += credit.amount;
			}
		});
		return total;
	}.property("controller.results"),

	escrowTotal: Ember.computed.alias("controller.controllers.marketplace.in_escrow"),
	isEscrowValid: function() {
		var total = this.get("payoutTotal");
		var escrow = this.get("escrowTotal");
		return total <= escrow;
	}.property("payoutTotal", "escrowTotal"),

	getFileText: function(file, cb) {
		var reader = new FileReader();
		reader.onload = function(event) {
			cb(event.target.result);
		};
		reader.readAsText(file);
	},

	actions: {
		fileSelectionChanged: function() {
			var self = this;
			var file = event.target.files[0];
			this.getFileText(file, function(text) {
				self.set("controller.reader.body", text);
			});
		},

		submit: function() {
			this.get("controller").process(this.get("table_rows"));
		}
	}
});
