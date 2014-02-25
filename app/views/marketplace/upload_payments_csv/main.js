var Computed = {
	readOnly: function(propertyName) {
		return function() {
			return this.get(propertyName);
		}.property(propertyName);
	}
};

Balanced.MarketplaceUploadPaymentsCsvView = Ember.View.extend({

	creditCreators: Computed.readOnly("controller.creditCreators"),

	payoutTotal: Balanced.computed.sum("creditCreators.valid", "credit.amount"),
	escrowTotal: Computed.readOnly("controller.controllers.marketplace.in_escrow"),

	isProcessable: Ember.computed.and("isEscrowValid", "creditCreators.isValid"),
	isUnprocessable: Ember.computed.not("isProcessable"),

	displayCsvRows: Ember.computed.and("creditCreators.length", "isEscrowValid", "creditCreators.isLoaded"),

	isEscrowValid: function() {
		var total = this.get("payoutTotal");
		var escrow = this.get("escrowTotal");
		return total <= escrow;
	}.property("payoutTotal", "escrowTotal"),

	updateReaderBody: function(text) {
		var self = this;
		var modal = this.get("parseProgressBarModal");

		self.get("controller").refresh(text);
		modal.refresh(this.get("creditCreators"));
	},

	actions: {
		reset: function() {
			this.updateReaderBody(undefined);
		},

		confirmRemoveCreditCreator: function(creator) {
			var self = this;
			var modal = this.get("confirmRemoveModal");
			modal.on("cancel", function() {
				modal.send("close");
				modal.reset();
			});
			modal.on("confirm", function() {
				self.get("controller").send("removeCreditCreator", creator);
				modal.send("close");
				modal.reset();
			});
			modal.send("open");
		},

		submit: function() {
			var modal = this.get("saveProgressBarModal");
			modal.refresh(this.get("creditCreators"));
			this.get("controller").save(function() {
				modal.hide();
			});
		},

		fileSelectionChanged: function() {
			var self = this;
			var file = event.target.files[0];
			var reader = new FileReader();
			reader.onload = function(event) {
				var text = event.target.result;
				self.updateReaderBody(text);
			};
			reader.readAsText(file);
		}
	}
});
