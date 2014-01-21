Balanced.MarketplaceUploadPaymentsCsvView = Balanced.View.extend({

	reader: function() {
		return this.get("controller.reader");
	}.property("controller.reader"),

	isSubmittable: function() {
		return this.get("table_rows").any(function(row) {
			return row.get("isSubmittable");
		});
	}.property("table_rows.@each.isSubmittable"),

	credits: function() {
		return this.get("table_rows").mapBy("credit");
	}.property("table_rows"),

	table_headers: function() {
		return this.get("reader.column_names");
	}.property("reader.body"),

	table_rows: function() {
		return this.get("controller.csvRowObjects");
	}.property("controller.csvRowObjects"),

	getFileText: function(file, cb) {
		var reader = new FileReader();
		reader.onload = function(event) {
			cb(event.target.result);
		};
		reader.readAsText(file);
	},

	actions: {
		fileSelectionChanged: function() {
			var self = this;
			var file = event.target.files[0];
			this.getFileText(file, function(text) {
				self.set("controller.reader.body", text);
			});
		},

		submit: function() {
			this.get("controller").process(this.get("table_rows"));
		}
	}
});
