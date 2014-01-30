Balanced.MarketplaceUploadPaymentsCsvView = Balanced.View.extend({

	hasItems: function(){
		return this.getCreditCreators().length > 0
	}.property("controller.creditCreators"),

	displayCsvRows: Ember.computed.and("hasItems", "isEscrowValid"),

	getCreditCreators: function () {
		return this.get("controller.creditCreators") || [];
	},

	payoutTotal: function() {
		var total = 0;

		this.getCreditCreators().forEach(function(creditCreator) {
			var amount = creditCreator.get("credit.amount");
			if (amount) {
				total += amount;
			}
		});
		return total;
	}.property("controller.creditCreators"),

	isEscrowValid: function() {
		var total = this.get("payoutTotal");
		var escrow = this.get("escrowTotal");
		return total <= escrow;
	}.property("payoutTotal", "escrowTotal"),

	escrowTotal: Ember.computed.alias("controller.controllers.marketplace.in_escrow"),
	isProcessable: Ember.computed.and("isEscrowValid", "isAllValid"),
	isUnprocessable: Ember.computed.not("isProcessable"),

	validRows: Ember.computed.filter('controller.creditCreators', function(creator) {
		return creator.isValid();
	}),

	invalidRows: Ember.computed.filter('controller.creditCreators', function(creator) {
		return !creator.isValid();
	}),

	isAllValid: function () {
		return this.get("invalidRows.length") === 0;
	}.property("invalidRows.length"),

	updateReaderBody: function(text) {
		this.set("controller.reader.body", text);
	},

	actions: {
		reset: function() {
			this.updateReaderBody(undefined);
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
