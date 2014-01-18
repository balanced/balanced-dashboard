Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({
	needs: ["marketplace"],
	content: null,

	expected_column_fields: function() {
		return this.get("payments_csv_reader").expected_columns;
	}.property("payments_csv_reader"),

	upload_error_messages: ["No file provided"],

	current_step: "step-1",

	is_step_1: function() {
		return this.get("current_step") === "step-1";
	}.property("current_step"),

	is_step_2: function() {
		return this.get("current_step") === "step-2";
	}.property("current_step"),

	is_step_3: function() {
		return this.get("current_step") === "step-3";
	}.property("current_step"),

	is_step_4: function() {
		return this.get("current_step") === "step-4";
	}.property("current_step"),

	is_step_5: function() {
		return this.get("current_step") === "step-5";
	}.property("current_step"),

	current_escrow_balance: 100,

	actions: {
		back: function() {
			var currentStep = this.get("current_step");
			var nextStep = this.get("current_step") === "step-3" ?
				"step-2" :
				"step-1";
			this.set("current_step", nextStep);
		},
		fileSelectionChanged: function() {
			var file = event.target.files[0];
			this.set("file", file);
		},
		readFile: function() {
			var self = this;
			var reader = new FileReader();
			reader.onload = function(e) {
				var fullText = e.target.result;
				var paymentsCsvReader = Balanced.PaymentsCsvReader.create({
					body: fullText
				});
				self.set("payments_csv_reader", paymentsCsvReader);
				self.set("uploaded_column_names", paymentsCsvReader.get("column_names"));
				self.set("columns_valid", paymentsCsvReader.columnsMatch(self.get("expected_column_fields")));
				self.set("current_step", "step-2");
			};
			reader.readAsText(this.get('file'));
		},

		mapFileColumns: function() {
			var paymentsCsvReader = this.get("payments_csv_reader");
			this.set("total_payout_balance", paymentsCsvReader.totalPayoutBalance());
			this.set("total_number_of_customers", paymentsCsvReader.totalNumberOfCustomers());
			this.get("upload_error_messages").clear();
			this.set("current_step", "step-3");
		},

		save: function() {
			var self = this;
			var paymentsCsvReader = this.get("payments_csv_reader");
			self.set("uploaded_count", 0);
			self.set("total_number_of_transactions", paymentsCsvReader.getTotalNumberOfTransactions());
			paymentsCsvReader
				.save(function(uploaded, total) {
					self.set("uploaded_count", uploaded);
				})
				.then(function() {
					self.set("current_step", "step-5");
				});
			this.set("current_step", "step-4");
		}

	}
});
