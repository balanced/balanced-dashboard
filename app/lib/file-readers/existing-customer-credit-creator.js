import Customer from "balanced-dashboard/models/customer";
import CreditCreator from "./credit-creator";
import baseValidationsObject from "./base-validations";
import CreditCreatorFields from "./credit-creator-fields";

var ExistingCustomerCreditCreator = CreditCreator.extend({
	validations: _.extend({}, baseValidationsObject, {
		"csvFields.existing_customer_name_or_email": {
			presence: true,
		},
		customer: {
			existence: {
				validator: function(object, attribute, customer) {
					var matchesLength = object.get("customersCollection.length");

					if (matchesLength === 0) {
						object.get("validationErrors").add("csvFields.existing_customer_name_or_email", "existence", null, "no matching customer found");
					} else if (matchesLength > 1) {
						object.get("validationErrors").add("csvFields.existing_customer_name_or_email", "existence", null, "multiple customers found");
					}
				}
			}
		},
		bankAccount: {
			existence: {
				validator: function(object, attribute, value) {
					var matchesLength = object.get("customer.bank_accounts.length");

					if (matchesLength === 0) {
						object.get("validationErrors").add("bankAccount", "existence", null, "no bank accounts available");
					} else if (matchesLength > 1) {
						object.get("validationErrors").add("bankAccount", "existence", null, "multiple bank accounts found");
					}
				}
			}
		},
	}),

	getErrorObject: function() {
		return this.getProperties(
			"existing_customer_name_or_email",
			"amount",
			"appears_on_statement_as",
			"description"
		);
	},

	fieldNames: CreditCreatorFields.EXISTING_CUSTOMER_FIELDS,
	isExisting: true,

	save: function() {
		return this.get('credit').save();
	},

	customer: function() {
		var collection = this.get("customersCollection");

		if (collection) {
			return collection.get("length") === 1 ?
				collection.objectAt(0) :
				null;
		}
		return undefined;
	}.property("customersCollection", "customersCollection.length"),

	bankAccount: function() {
		var customer = this.get("customer");
		var collection = this.get("customer.bank_accounts");

		if (customer === null) {
			return null;
		} else if (collection) {
			return collection.get("length") === 1 ?
				collection.objectAt(0) :
				null;
		}
		return undefined;
	}.property("customer", "customer.bank_accounts", "customer.bank_accounts.length")
});

ExistingCustomerCreditCreator.reopenClass({
	fieldNames: CreditCreatorFields.EXISTING_CUSTOMER_FIELDS,
	createFromQuery: function(marketplace, attributes) {
		var creator = this.create({
			csvFields: attributes
		});

		var results = Customer.findByNameOrEmail(marketplace, attributes.existing_customer_name_or_email);
		results.addObserver("isLoaded", function() {
			creator.set("customersCollection", results);
		});
		creator.addObserver("isLoaded", function() {
			creator.validate();
		});

		return creator;
	}
});

export default ExistingCustomerCreditCreator;
