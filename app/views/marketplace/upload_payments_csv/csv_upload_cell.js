require("app/views/popover");

var BaseCellView = Balanced.View.extend({
	tagName: "td",
	fieldsErrors: function() {
		return this.get("context.validationErrors.csvFields");
	}.property("context")
});

Balanced.CsvUploadCellView = BaseCellView.extend({
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

	isErrorField: Ember.computed.gt("errorMessages.length", 0),

	errorMessages: function() {
		var fieldName = this.get("fieldName");
		var errors = this.get("fieldsErrors");
		if (errors) {
			errors = errors.get(fieldName);
		}
		return errors || [];
	}.property("fieldName", "fieldsErrors"),

	isError: function() {
		var length = this.get("errorMessages.length");
		return length > 0;
	}.property("errorMessages"),

	fieldValue: function() {
		var fieldName = this.get("fieldName");
		var fields = this.get("context.csvFields");
		if (fields) {
			var value = (fields[fieldName] || "").trim();
			if (value.trim().length > 0) {
				return value;
			}
		}
		return undefined;
	}.property("context.csvFields"),

	hasIsRequiredError: function() {
		var messages = this.get("errorMessages.allMessages") || [];
		var fname = this.get("fieldName");
		return messages.any(function(array, index) {
			return array[1] === "can't be blank";
		});
	}.property("errorMessages"),

	displayValue: function() {
		var f = this.get("fieldValue");
		if (f) {
			return f;
		} else if (this.get("hasIsRequiredError")) {
			return "required";
		} else {
			return "----------";
		}
	}.property("fieldValue", "hasIsRequiredError")
});

Balanced.DefaultCsvUploadCellView = Balanced.CsvUploadCellView.extend({
	templateName: "marketplace/upload_payments_csv/default_csv_upload_cell",
});

Balanced.ErrorTooltipCsvUploadCellView = BaseCellView.extend({
	templateName: "marketplace/upload_payments_csv/error_tooltip_csv_upload_cell",
	classNames: ["table-column", "table-column-icons"],

	didInsertElement: function() {
		this._super();
		if (this.get("isError")) {
			this.initializePopover();
		}
	},

	isError: function() {
		return this.get("context.isInvalid");
	}.property("context"),

	getSortedErrorMessages: function() {
		var result = {};
		var errors = this.get("fieldsErrors.allMessages");
		errors.forEach(function(value) {
			var key = value[0];
			var message = value[1];

			result[message] = result[message] || [];
			result[message].push(key);
		});
		return result;
	},

	initializePopover: function() {
		var self = this;
		var title = this.get("fieldsErrors.length") === 1 ?
			"Invalid field:" : "Invalid fields:";

		self.$("[data-tooltip]").popover({
			trigger: "hover",
			placement: "top",
			title: title,
			html: true,
			content: function() {
				var messages = [];
				_.each(self.getSortedErrorMessages(), function(fieldNames, message) {
					var str = "<p><span class='keys'>%@</span> %@</p>".fmt(
						fieldNames.join(", "),
						message
					);
					messages.push(str);
				});
				return messages.join("");
			}
		});
	}
});
