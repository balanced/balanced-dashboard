import CreditCreator from "./credit-creator";
import CreditCreatorFields from "./credit-creator-fields";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";
import CreditCreatorCsvObjectMapper from "./credit-creator-csv-object-mapper";
import Customer from "balanced-dashboard/models/customer";
import BankAccount from "balanced-dashboard/models/bank-account";
import baseValidationsObject from "./base-validations";

var NewCustomerCreditCreator = CreditCreator.extend({
	fieldNames: CreditCreatorFields.NEW_CUSTOMER_FIELDS,

	getErrorObject: function() {
		var properties = this.getProperties(
			"new_customer_name",
			"new_customer_email",
			"new_bank_routing_number",
			"new_bank_account_holders_name",
			"new_bank_account_type",
			"amount",
			"appears_on_statement_as",
			"description"
		);

		var bankAccountNumber = this.get("new_bank_account_number");

		properties.new_bank_account_number = bankAccountNumber && bankAccountNumber.length > 0 ?
			"HIDDEN" :
			"EMPTY";
		return properties;
	},

	validations: _.extend({}, baseValidationsObject, {
		"csvFields.new_customer_name": {
			presence: true
		},
		"csvFields.new_customer_email": {
			presence: true
		},
		"csvFields.new_bank_routing_number": ValidationHelpers.bankAccountRoutingNumber,
		"csvFields.new_bank_account_number": ValidationHelpers.bankAccountNumber,
		"csvFields.new_bank_account_holders_name": ValidationHelpers.bankAccountName,
		"csvFields.new_bank_account_type": ValidationHelpers.bankAccountType,
	}),

	isExisting: false,

	bankAccount: function() {
		var mapper = CreditCreatorCsvObjectMapper.create();
		var attr = mapper.extractBankAccountAttributes(this.get("csvFields"));
		return BankAccount.create(attr);
	}.property("csvFields"),

	customer: function() {
		var mapper = CreditCreatorCsvObjectMapper.create();
		var attr = mapper.extractCustomerAttributes(this.get("csvFields"));
		return Customer.create(attr);
	}.property("csvFields"),

	save: function() {
		var self = this;

		if (!self.canSave()) {
			return Ember.RSVP.reject();
		}

		return self.get("customer").save()
			.then(function() {
				return self.get("bankAccount").save();
			})
			.then(function() {
				var bankAccount = self.get("bankAccount");
				bankAccount.set("links.customer", self.get("customer.id"));
				return bankAccount.save();
			})
			.then(function() {
				return self.get("credit").save();
			});
	}
});

NewCustomerCreditCreator.reopenClass({
	fieldNames: CreditCreatorFields.NEW_CUSTOMER_FIELDS,
});

export default NewCustomerCreditCreator;
