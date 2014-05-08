require("app/views/popover");

var BaseCellView = Balanced.View.extend({
	tagName: "td",
	fieldsErrors: function() {
		return this.get("context.validationErrors.csvFields");
	}.property("context")
});

Balanced.CsvUploadCellView = BaseCellView.extend({
	didInsertElement: function() {
		this._super();
		if (this.get("isError")) {
			this.initializePopover();
		}
	},

	labelClasses: function() {
		var classes = ["label"];
		if (this.get("isError")) {
			classes.push("label-error");
		}

		if (this.get("hasIsRequiredError")) {
			classes.push("label-required");
		} else if (!this.get("fieldValue")) {
			classes.push("label-blank");
		}
		return classes.join(" ");
	}.property("fieldValue", "isError"),

	isError: Ember.computed.gt("errorMessages.length", 0),
	errorMessages: function() {
		var fieldName = this.get("fieldName");
		var errors = this.get("fieldsErrors");
		if (errors) {
			errors = errors.get(fieldName);
		}
		return errors || [];
	}.property("fieldName", "fieldsErrors"),

	fieldValue: function() {
		var fieldName = this.get("fieldName");
		var fields = this.get("context.csvFields");
		if (fields) {
			var value = (fields[fieldName] || "").trim();
			if (value.length > 0) {
				return value;
			}
		}
		return undefined;
	}.property("context.csvFields"),

	hasIsRequiredError: function() {
		var messages = this.get("errorMessages.allMessages") || [];
		return messages.any(function(array, index) {
			return array[1] === "can't be blank";
		});
	}.property("errorMessages"),

	titleValue: Ember.computed.readOnly("fieldValue"),

	displayValue: function() {
		var f = this.get("fieldValue");
		if (f) {
			return f;
		} else if (this.get("hasIsRequiredError")) {
			return "required";
		} else {
			return "----------";
		}
	}.property("fieldValue", "hasIsRequiredError"),

	initializePopover: function() {
		var self = this;
		this.$("[data-tooltip]").popover({
			trigger: "hover",
			placement: "top",
			html: true,
			content: function() {
				var messages = self.get("errorMessages.messages");
				var label = messages.get("length") > 1 ?
					"Errors" :
					"Error";
				return "<span class='label'>%@: </span> %@".fmt(
					label,
					messages.join(", ")
				);
			}
		});
	}
});

Balanced.DefaultCsvUploadCellView = Balanced.CsvUploadCellView.extend({
	templateName: "import_payouts/default_csv_upload_cell",
});

Balanced.CurrencyCsvUploadCellView = Balanced.CsvUploadCellView.extend({
	templateName: "import_payouts/default_csv_upload_cell",

	displayValue: function() {
		if (this.get("isError")) {
			return this._super();
		} else {
			return Balanced.Utils.formatCurrency(this.get("fieldValue"));
		}
	}.property("fieldValue", "hasIsRequiredError", "isError")
});
