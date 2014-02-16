Balanced.CsvUploadCellView = Balanced.View.extend({
	tagName: "td",

	errorMessages: function() {
		var fieldName = this.get("fieldName");
		var errors = this.get("context.validationErrors.csvFields");
		if (errors) {
			errors = errors.get(fieldName);
		}
		return errors || [];
	}.property("fieldName"),

	cssClasses: function() {
		var classes = [];

		if (this.get("class")) {
			classes.push(this.get("class"));
		}

		if (this.get("isError")) {
			classes.push("label");
			classes.push("label-error");
		}
		return classes.join(" ");
	}.property("errorMessages"),

	isError: function() {
		var length = this.get("errorMessages.length");
		return length > 0;
	}.property("errorMessages"),

	value: function() {
		var fieldName = this.get("fieldName");
		var fields = this.get("context.csvFields");
		if (fields) {
			return fields[fieldName];
		} else {
			return "";
		}
	}.property("context.csvFields")
});

Balanced.DefaultCsvUploadCellView = Balanced.CsvUploadCellView.extend({
	templateName: "marketplace/upload_payments_csv/default_csv_upload_cell",
});
