Balanced.CreditCreatorCsvObjectMapper = Ember.Object.extend({
	deserializers: {
		string: function(val) {
			return val.length ?
				val : undefined;
		},
		lowerCaseString: function(string) {
			var v = this.string(string);
			return v && v.toLowerCase();
		},
		number: function(v) {
			var value = parseFloat(v, 10);
			if (isNaN(value)) {
				return undefined;
			} else {
				return value;
			}
		}
	},

	deserialize: function(type, value) {
		value = value || "";
		value = value
			.replace(/^\s+/g, "")
			.replace(/\s+$/g, "");
		return this.deserializers[type](value);
	},

	extractBankAccountAttributes: function(object) {
		return {
			id: this.deserialize("string", object.bank_account_id),
			routing_number: this.deserialize("string", object.new_bank_account_routing_number),
			account_number: this.deserialize("string", object.new_bank_account_number),
			name: this.deserialize("string", object.new_bank_account_holders_name),
			type: this.deserialize("lowerCaseString", object.new_bank_account_type)
		};
	},

	extractCustomerAttributes: function(object) {
		return {
			name: this.deserialize("string", object.new_customer_name),
			email: this.deserialize("string", object.new_customer_email)
		};
	},

	extractCreditAttributes: function(object) {
		return {
			amount: this.deserialize("number", object.amount_in_cents),
			appears_on_statement_as: this.deserialize("string", object.appears_on_statement_as),
			description: this.deserialize("string", object.description)
		};
	},

	convertCreditCsvRowToObject: function(object) {
		return {
			credit: this.extractCreditAttributes(object),
			bank_account: this.extractBankAccountAttributes(object),
			customer: this.extractCustomerAttributes(object)
		};
	}
});
