Balanced.MarketplaceUploadPaymentsCsvView = Balanced.View.extend({

	creditCreators: Ember.computed.alias("controller.creditCreators"),

	hasItems: function() {
		var array = this.get("creditCreators") || [];
		return array.length > 0;
	}.property("creditCreators"),

	displayCsvRows: Ember.computed.and("hasItems", "isEscrowValid"),

	payoutTotal: function() {
		var total = 0;

		this.get("creditCreators").forEach(function(creditCreator) {
			var amount = creditCreator.get("credit.amount");
			if (amount) {
				total += amount;
			}
		});
		return total;
	}.property("creditCreators"),

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

	unprocessableTotal: function() {
		var total = 0;

		this.get("unprocessableRows").forEach(function(creditCreator) {
			var amount = creditCreator.get("credit.amount");
			if (amount) {
				total += amount;
			}
		});
		return total;
	}.property("unprocessableRows"),

	unprocessableRows: function() {
		return this.get("invalidRows").filter(function(creator) {
			return !creator.get("isRemoved");
		});
	}.property("invalidRows.@each.isRemoved"),

	isAllValid: function() {
		return this.get("invalidRows").every(function(creator) {
			return creator.get("isRemoved");
		});
	}.property("invalidRows", "invalidRows.@each", "invalidRows.@each.isRemoved"),

	updateReaderBody: function(text) {
		this.set("controller.reader.body", text);
	},

	updateProgressFraction: function() {
		var completedRows = this.get("creditCreators").filter(function(creator) {
			return creator.get("isComplete");
		});
		var validRows = this.get("validRows");

		var fraction = completedRows.length / validRows.length;
		var text = "" + completedRows.length + "/" + validRows.length;

		this.get("progressBarModal").update(fraction, text);
	}.observes("creditCreators.@each.isComplete"),

	actions: {
		reset: function() {
			this.updateReaderBody(undefined);
		},

		submit: function() {
			var self = this;
			var modal = this.get("progressBarModal");
			modal.send("open");
			modal.update(0);

			this.get("controller").save(function () {
				var count = self.get("validRows").length;
				modal.send("close");
				self.get('controller').send('alert', {
					message: "" + count + " payouts were successfully submitted",
					persists: false,
					type: "success"
				});
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
