require("app/views/popover");

var initializePopover = function(self, label, selector, messagesProperty) {
	var $element = self.$(selector);
	var position = $element.attr("data-position") || "top";
	return $element.popover({
		trigger: "hover",
		placement: position,
		html: true,
		content: function() {
			var messages = self.get(messagesProperty);
			return "<span class='label'>%@: </span> %@".fmt(
				label,
				messages.join(", ")
			);
		}
	});
};

Balanced.CsvUploadCellView = Balanced.View.extend({
	tagName: "td",
	fieldsErrors: function() {
		return this.get("context.validationErrors.csvFields");
	}.property("context", "context.validationErrors.csvFields"),

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
		initializePopover(this, this.get("fieldName"), "[data-tooltip]", 'errorMessages.messages');
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
			return Balanced.Utils.formatCurrency(this.get("context.credit.amount"));
		}
	}.property("fieldValue", "hasIsRequiredError", "isError")
});

Balanced.ExistingCustomerIdentityCsvUploadCellView = Balanced.CsvUploadCellView.extend({
	classNames: ["csv-customer-profile"],

	customer: Ember.computed.readOnly("context.customer"),
	bankAccount: Ember.computed.readOnly("context.bankAccount"),

	hasBankAccountRequiredError: function() {
		var customer = this.get("customer");
		var bankAccount = this.get("bankAccount");
		return customer && !bankAccount;
	},

	bankAccountDisplayValue: function() {
		var object = this.get("bankAccount");
		if (object) {
			return object.get("description");
		} else if (this.hasBankAccountRequiredError()) {
			return "required";
		} else {
			return "------------";
		}
	}.property("bankAccount"),

	customerDisplayValue: function() {
		var object = this.get("customer");
		if (object === null || object === undefined) {
			return this.get("context.csvFields.existing_customer_name_or_email");
		} else {
			return object.get("name");
		}
	}.property("customer"),

	bankAccountLabelClasses: function() {
		var array = ["label", "label-bank-account"];
		if (this.get("customer") === null) {
			array.push("label-blank");
		} else if (this.get("bankAccountErrorMessages.length")) {
			array.push("label-error");
		}

		if (this.hasBankAccountRequiredError()) {
			array.push("label-required");
		}
		return array.join(" ");
	}.property("bankAccountErrorMessages"),

	customerLabelClasses: function() {
		var array = ["label"];
		var object = this.get("customer");
		if (object === null || object === undefined) {
			array.push("label-required");
			array.push("label-error");
		}
		return array.join(" ");
	}.property("customer"),

	initializeCustomerPopover: function() {
		initializePopover(this, "existing_customer_name_or_email", ".customer-name-tooltip", "customerErrorMessages");
	},

	initializeBankAccountPopover: function() {
		initializePopover(this, "Bank account", ".bank-description-tooltip", 'bankAccountErrorMessages');
	},

	bankAccountErrorMessages: Ember.computed.readOnly("context.validationErrors.bankAccount.messages"),
	customerErrorMessages: Ember.computed.readOnly("context.validationErrors.csvFields.existing_customer_name_or_email.messages"),

	isError: function() {
		return this.get("bankAccountErrorMessages.length") || this.get("customerErrorMessages.length");
	}.property("bankAccountErrorMessages.lenght", "customerErrorMessages.length"),

	initializePopover: function() {
		if (this.get("bankAccountErrorMessages.length")) {
			this.initializeBankAccountPopover();
		}
		if (this.get("customerErrorMessages.length")) {
			this.initializeCustomerPopover();
		}
	}
});
