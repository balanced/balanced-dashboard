Balanced.MarketplaceUploadPaymentsCsvView = Balanced.View.extend({

	creditCreators: Ember.computed.alias("controller.creditCreators"),

	displayCsvRows: Ember.computed.and("creditCreators.hasItems", "isEscrowValid"),

	payoutTotal: Balanced.computed.sum("validRows", "credit.amount"),

	isEscrowValid: function() {
		var total = this.get("payoutTotal");
		var escrow = this.get("escrowTotal");
		return total <= escrow;
	}.property("payoutTotal", "escrowTotal"),

	escrowTotal: Ember.computed.alias("controller.controllers.marketplace.in_escrow"),

	isProcessable: Ember.computed.and("isEscrowValid", "isAllValid"),
	isUnprocessable: Ember.computed.not("isProcessable"),

	validRows: Ember.computed.filter('creditCreators', function(creator) {
		return creator.isValid();
	}),

	invalidRows: Ember.computed.filter('creditCreators', function(creator) {
		return !creator.isValid();
	}),

	isAllValid: function() {
		return this.get("invalidRows").every(function(creator) {
			return creator.get("isRemoved");
		});
	}.property("invalidRows.@each.isRemoved"),

	updateReaderBody: function(text) {
		this.get("controller").refresh(text);
	},

	updateProgressFraction: function() {
		var completedRows = this.get("creditCreators").filter(function(creator) {
			return creator.get("isComplete");
		});
		var validLength = this.get("creditCreators.valid.length");

		var fraction = completedRows.length / validLength;
		var text = "" + completedRows.length + "/" + validLength;

		this.get("progressBarModal").update(fraction, text);
	}.observes("creditCreators.@each.isComplete"),

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
			modal.send("open");
			modal.update(0);

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
