Balanced.MarketplaceUploadPaymentsCsvFileSelectionView = Balanced.WizardStepView.extend({

	payout_total: function() {
		var reader = this.get("reader");
		return reader ?
			reader.totalPayoutBalance() :
			null;
	}.property("reader"),

	customers_total: function() {
		var reader = this.get("reader");
		return reader ?
			reader.totalNumberOfCustomers() :
			null;
	}.property("reader"),

	readFile: function(file, callback) {
		var reader = new FileReader();
		reader.onload = function(event) {
			var fullText = event.target.result;
			var paymentsCsvReader = Balanced.PaymentsCsvReader.create({
				body: fullText
			});
			callback(paymentsCsvReader);
		};
		reader.readAsText(file);
	},

	actions: {
		fileSelectionChanged: function() {
			var self = this;
			var file = event.target.files[0];
			this.set("file", file);
			this.readFile(file, function(reader) {
				self.set("reader", reader);
			});
		},

		submit: function() {
			var self = this;
			self.readFile(this.get("file"), function(paymentsReader) {
				var controller = self.get("controller");
				controller.startProcessing(paymentsReader);
			});
		}
	}
});
