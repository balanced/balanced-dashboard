require("app/views/popover");

Balanced.CsvUploadCellView = Balanced.View.extend({
	tagName: "td",
	fieldsErrors: function() {
		return this.get("context.validationErrors.csvFields");
	}.property("context"),

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

Balanced.ExistingCustomerIdentityCsvUploadCellView = Balanced.CsvUploadCellView.extend({
	classNames: ["csv-customer-profile"],

	customer: Ember.computed.readOnly("context.customer"),
	bankAccount: Ember.computed.readOnly("context.bankAccount"),

	bankAccountDisplayValue: function() {
		var object = this.get("bankAccount");
		if (object === null || object === undefined) {
			return "required";
		}
		else {
			return object.get("description");
		}
	}.property("bankAccount"),

	customerDisplayValue: function() {
		var object = this.get("customer");
		if (object === null || object === undefined) {
			return this.get("context.csvFields.existing_customer_name_or_email");
		}
		else {
			return object.get("name");
		}
	}.property("customer"),

	bankAccountLabelClasses: function() {
		var array = ["label", "label-bank-account"];
		var object = this.get("bankAccount");
		if (object === null || object === undefined) {
			array.push("label-required");
			array.push("label-error");
		}
		return array.join(" ");
	}.property("bankAccount"),

	customerLabelClasses: function() {
		var array = ["label"];
		var object = this.get("customer");
		if (object === null || object === undefined) {
			array.push("label-required");
			array.push("label-error");
		}
		return array.join(" ");
	}.property("customer"),

	initializeCustomerPopover: function() {},

	initializeBankAccountPopover: function() {
		var self = this;
		this.$(".bank-description-tooltip[data-tooltip]").popover({
			trigger: "hover",
			placement: "top",
			html: true,
			content: function() {
				var messages = self.get("context.validationErrors.bankAccount.errorMessages");
				var label = messages.get("length") > 1 ?
					"Errors" :
					"Error";
				return "<span class='label'>%@: </span> %@".fmt(
					label,
					messages.join(", ")
				);
			}
		});

	},

	initializePopover: function() {
		this.initializeBankAccountPopover();
		this.initializeCustomerPopover();
	}
});
