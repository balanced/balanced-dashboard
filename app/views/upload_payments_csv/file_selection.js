Balanced.MarketplaceUploadPaymentsCsvView = Balanced.View.extend({

	init: function() {
		this._super();
		var reader = Balanced.CsvReader.create();
		this.set("reader", reader);
	},

	credits: function() {
		return this.get("table_rows").mapBy("credit");
	}.property("table_rows"),

	table_headers: function() {
		return this.get("reader.column_names");
	}.property("reader.body"),

	table_rows: function() {
		return this.get("reader").getObjects().map(function(object) {
			return Balanced.CsvPaymentRow.create({
				baseObject: object
			});
		});
	}.property("reader.body"),

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
				self.get("reader").set("body", text);
			});
		},

		submit: function() {
			this.get("controller").process(this.get("table_rows"));
		}
	}
});
