Balanced.MarketplaceUploadPaymentsCsvView = Balanced.View.extend({

	creditCreators: Ember.computed.alias("controller.creditCreators"),

	payoutTotal: Balanced.computed.sum("creditCreators.valid", "credit.amount"),

	escrowTotal: Ember.computed.alias("controller.controllers.marketplace.in_escrow"),

	isProcessable: Ember.computed.and("isEscrowValid", "isAllValid"),
	isUnprocessable: Ember.computed.not("isProcessable"),

	validRows: Ember.computed.filterBy('creditCreators.isValid'),
	invalidRows: Ember.computed.filterBy('creditCreators.isInvalid'),

	isAllValid: Ember.computed.equal("invalidRows.length", 0),

	isEscrowValid: function() {
		var total = this.get("payoutTotal");
		var escrow = this.get("escrowTotal");
		return total <= escrow;
	}.property("payoutTotal", "escrowTotal"),

	displayCsvRows: function() {
		return this.get("creditCreators.length") > 0 && this.get("isEscrowValid");
	}.property("creditCreators.length", "isEscrowValid"),

	updateReaderBody: function(text) {
		this.get("controller").refresh(text);
	},

	blockBankAccountLoad: function() {
		var collection = this.get("creditCreators");
		var modal = this.get("progressBarModal");

		var loadedCount = collection.filterBy("isLoaded").get("length");
		var total = collection.get("length");

		var text = "%@/%@".fmt(loadedCount, total);
		modal.update(loadedCount / total, text);

		if (loadedCount === total) {
			modal.hide();
		} else {
			modal.set("title", "Loading Data");
			modal.show();
		}
	}.observes("creditCreators.@each.isLoaded"),

	updateProgressFraction: function() {
		var completedRows = this.get("creditCreators").filter(function(creator) {
			return creator.get("isSaved");
		});
		var validLength = this.get("creditCreators.valid.length");

		var fraction = completedRows.length / validLength;
		var text = "%@/%@".fmt(completedRows.length, validLength);

		this.get("progressBarModal").update(fraction, text);
	}.observes("creditCreators.@each.isSaved"),

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
			var modal = this.get("progressBarModal");
			modal.set("title", "Submitting Payouts");
			modal.send("open");
			this.updateProgressFraction();

			this.get("controller").save(function() {
				modal.send("close");
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
