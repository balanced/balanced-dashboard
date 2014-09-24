import CreditCreatorFields from "./credit-creator-fields";
import Constants from "balanced-dashboard/utils/constants";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";
import CreditCreatorCsvObjectMapper from "./credit-creator-csv-object-mapper";
import Credit from "balanced-dashboard/models/credit";
import baseValidationsObject from "./base-validations";

import ExistingCustomerCreditCreator from "./existing-customer-credit-creator";
import NewCustomerCreditCreator from "./new-customer-credit-creator";

var CreditCreator = Ember.Object.extend(Ember.Validations, {

	isInvalid: Ember.computed.gt("validationErrors.length", 0),
	isValid: Ember.computed.not("isInvalid"),

	appears_on_statement_max_length: Constants.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,

	isLoaded: function() {
		var self = this;
		var fields = ["credit", "bankAccount", "customer"];
		return fields.every(function(field) {
			return self.get(field) !== undefined;
		});
	}.property("credit", "bankAccount", "customer"),

	isSaved: Ember.computed.not("credit.isNew"),
	isSaveable: Ember.computed.and("credit.isNew", "isValid"),

	canSave: function() {
		var self = this;
		return this.get("isValid") && _.every(["bankAccount", "credit", "customer"], function(key) {
			return self.get(key).get("isValid");
		});
	},

	credit: function() {
		var mapper = CreditCreatorCsvObjectMapper.create();
		var attr = mapper.extractCreditAttributes(this.get("csvFields"));
		var customer = this.get("customer");
		var bankAccount = this.get("bankAccount");

		var attributes = _.extend({}, attr, {
			customer: customer,
		});

		if (bankAccount) {
			_.extend(attributes, {
				destination: bankAccount,
				bank_account: bankAccount,
				uri: bankAccount.get("credits_uri")
			});
		}

		return Credit.create(attributes);
	}.property("csvFields", "bankAccount", "bankAccount.credits_uri", "customer"),

	getErrorMessagesSentences: function() {
		var self = this;
		var errors = [];
		["csvFields", "bankAccount", "customer"].forEach(function(name) {
			var messages = self.get("validationErrors." + name + ".allMessages") || [];
			errors = errors.concat(messages);
		});

		return errors.map(function(value) {
			return value.join(" ");
		});
	},

	toLabeledCsvRowObject: function() {
		var self = this;
		var result = {};
		var csvFields = self.get("fieldNames");

		_.each(csvFields, function(columnName) {
			result[columnName] = self.get("csvFields." + columnName) || "";
		});

		result.errors = this.getErrorMessagesSentences().join("\n");
		return result;
	}
});

CreditCreator.reopenClass({
	isValidCreditCreatorColumns: function(csvColumns) {
		var requiredColumns = [
			CreditCreatorFields.EXISTING_CUSTOMER_FIELDS,
			CreditCreatorFields.NEW_CUSTOMER_FIELDS
		];
		return requiredColumns.any(function(requiredColumns) {
			return _.difference(requiredColumns, csvColumns).length === 0;
		});
	},
	fromCsvRow: function(marketplace, object) {
		var creditCreator = null;

		if (object.existing_customer_name_or_email !== undefined) {
			creditCreator = ExistingCustomerCreditCreator.createFromQuery(marketplace, object);
		} else {
			creditCreator = NewCustomerCreditCreator.create({
				csvFields: object
			});
		}
		creditCreator.validate();
		return creditCreator;
	}
});

export default CreditCreator;

