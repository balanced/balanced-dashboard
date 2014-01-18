Balanced.MarketplaceUploadPaymentsCsvFileSelectionView = Balanced.WizardStepView.extend({

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
			var file = event.target.files[0];
			this.set("file", file);
		},

		submit: function() {
			var self = this;
			self.readFile(this.get("file"), function(paymentsReader) {
				var controller = self.get("controller");
				controller.setPaymentsReader(paymentsReader);
			});
		}
	}
});
