var CreditCreatorCsvObjectMapper = Ember.Object.extend({
	deserializers: {
		string: function(val) {
			return val.length ?
				$.trim(val) : undefined;
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
			routing_number: this.deserialize("string", object.new_bank_routing_number),
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
		var amount = this.deserialize("number", object.amount);
		if (amount) {
			amount = parseInt(amount * 100, 10);
		}
		return {
			amount: amount,
			appears_on_statement_as: this.deserialize("string", object.appears_on_statement_as),
			description: this.deserialize("string", object.description)
		};
	}
});

export default CreditCreatorCsvObjectMapper;
