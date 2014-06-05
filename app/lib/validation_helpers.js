var formatValidator = function(callback) {
	return {
		validator: function(object, attribute, value) {
			value = (value || "").trim();
			callback(object, attribute, value, function(messages) {
				messages = _.isArray(messages) ? messages : [messages];

				messages.forEach(function(message) {
					object.get("validationErrors").add(attribute, "format", null, message);
				});
			});
		}
	};
};

Balanced.ValidationHelpers = Ember.Namespace.create({
	positiveDollarAmount: {
		presence: true,
		format: formatValidator(function(object, attribute, value, cb) {
			try {
					var v = Balanced.Utils.dollarsToCents(value);
					if (isNaN(v) || v <= 0) {
						cb("must be a positive number");
					}
			} catch(e) {
				cb(e.message.replace("Error: ", ""));
			}
		})
	},
	transactionAppearsOnStatementAs: {
		presence: true,
		format: formatValidator(function(object, attribute, value, cb) {
			var maxLength = object.get("appears_on_statement_max_length");
			var messages = [];
			if (value.length > maxLength) {
				messages.push("must be under %@ characters".fmt(maxLength));
			}

			var invalidCharacters = Balanced.Transaction.findAppearsOnStatementAsInvalidCharacters(value);
			if (invalidCharacters.length === 1) {
				messages.push('"%@" is an invalid character'.fmt(invalidCharacters));
			} else if (invalidCharacters.length > 1) {
				messages.push('"%@" are invalid characters'.fmt(invalidCharacters));
			}
			cb(messages);
		})
	},
	bankAccountType: {
		presence: true,
		format: formatValidator(function(object, attribute, value, cb) {
			var validStrings = Balanced.BankAccount.ACCOUNT_TYPES.map(function(str) {
				return str.toLowerCase();
			});
			value = value.toLowerCase();
			if (validStrings.indexOf(value) < 0) {
				cb("%@ is not a valid bank account type".fmt(value));
			}
		})
	},
	bankAccountName: {
		presence: true
	},
	bankAccountNumber: {
		presence: true
	},
	bankAccountRoutingNumber: {
		presence: true,
		format: formatValidator(function(object, attribute, value, cb) {
			value = value.toLowerCase();
			if (!balanced.bankAccount.validateRoutingNumber(value)) {
				cb("%@ is not a valid bank routing number".fmt(value));
			}
		})
	},

})
