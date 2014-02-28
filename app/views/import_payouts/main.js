var Computed = {
	readOnly: function(propertyName) {
		return function() {
			return this.get(propertyName);
		}.property(propertyName);
	}
};

var SAMPLE_FILE = [
	"bank_account_id,new_bank_account_routing_number,new_bank_account_number,new_bank_account_holders_name,new_bank_account_type,new_customer_name,new_customer_email,appears_on_statement_as,description,amount",
	",123123123,123456789,William Henry Cavendish,Checking,William Henry Cavendish,whc@example.org,101Flowers.com,#0012345 ,41.35",
	",123123123,234567890,Mark Feldman,Savings,Mark Feldman,mark@example.org,101Flowers.com,#0078453,55.74",
	"BAmjovbXdpRsQUe1q34ee24,,,,,,,101Flowers.com,#0045795,57.73",
	"BA7Cv3FMXaOcD17dMVbqAXLI,,,,,,,101Flowers.com,#0052323,21.03"
].join("\n");

Balanced.ImportPayoutsView = Ember.View.extend({

	title: function(){
		return this.get("creditCreators.isEmpty") ?
			"Upload your file" :
			"Payout Summary";
	}.property("creditCreators.isEmpty"),

	sampleFileUri: function() {
		return "data:text/plain;charset=utf-8;base64," + window.btoa(SAMPLE_FILE);
	}.property(),

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
