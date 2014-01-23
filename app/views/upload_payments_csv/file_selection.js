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

	actions: {
		fileSelectionChanged: function() {
			var self = this;
			var file = event.target.files[0];
			var reader = new FileReader();
			reader.onload = function(event) {
				var text = event.target.result;
				self.set("controller.reader.body", text);
			};
			reader.readAsText(file);
		}
	}
});
