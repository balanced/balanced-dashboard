Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({
	needs: ["marketplace"],
	content: null,

	expected_column_fields: ["bank_account", "name", "amount"],
	upload_error_messages: ["No file provided"],

	current_escrow_balance: 100,

	actions: {
		fileSelectionChanged: function () {
			var file = event.target.files[0];
			this.set("file", file);
		},
		readFile: function () {
			var self = this;
			var reader = new FileReader();
			reader.onload = function(e) {
				var fullText = e.target.result;
				var paymentsCsvReader = Balanced.PaymentsCsvReader.create({
					body: fullText
				});
				self.set("payments_csv_reader", paymentsCsvReader);
				self.set("uploaded_column_names", paymentsCsvReader.get("column_names"));
			};
			reader.readAsText(this.get('file'));
		},

		mapFileColumns: function () {
			var paymentsCsvReader = this.get("payments_csv_reader");
			this.set("total_payout_balance", paymentsCsvReader.totalPayoutBalance());
			this.set("total_number_of_customers", paymentsCsvReader.totalNumberOfCustomers());
			this.get("upload_error_messages").clear();
		},
		save: function () {}
	}
});
