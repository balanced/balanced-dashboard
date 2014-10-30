import Ember from "ember";
import CsvUploadCellView from "./csv-upload-cell";
import initializePopover from "./initialize-popover";

var ExistingCustomerIdentityCsvUploadCellView = CsvUploadCellView.extend({
	classNames: ["csv-customer-profile"],

	customer: Ember.computed.reads("item.customer"),
	bankAccount: Ember.computed.reads("item.bankAccount"),

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
			return this.get("item.csvFields.existing_customer_name_or_email");
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

	bankAccountErrorMessages: Ember.computed.readOnly("item.validationErrors.bankAccount.messages"),
	customerErrorMessages: Ember.computed.readOnly("item.validationErrors.csvFields.existing_customer_name_or_email.messages"),

	isError: function() {
		return this.get("bankAccountErrorMessages.length") || this.get("customerErrorMessages.length");
	}.property("bankAccountErrorMessages.length", "customerErrorMessages.length"),

	initializePopover: function() {
		if (this.get("bankAccountErrorMessages.length")) {
			this.initializeBankAccountPopover();
		}
		if (this.get("customerErrorMessages.length")) {
			this.initializeCustomerPopover();
		}
	}
});

export default ExistingCustomerIdentityCsvUploadCellView;
