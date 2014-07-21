require("./transaction_factory");

Balanced.ReverseCreditTransactionFactory = Balanced.TransactionFactory.extend({
	isAmountOverMaximum: function() {
		return this.get("amount") > this.get("credit.reversal_amount");
	},
	isAmountPositive: function() {
		return this.get("amount") > 0;
	},

	validations: {
		dollar_amount: {
			format: {
				validator: function(object, attribute, value) {
					var message = function(message) {
						object.get("validationErrors").add(attribute, "format", null, message);
					};

					value = (value || "").toString().trim();
					if (Ember.isBlank(value)) {
						message("is required");
					} else if (object.isAmountOverMaximum()) {
						var maxAmount = object.get("credit.reversal_amount");
						message("cannot be more than %@".fmt(Balanced.Utils.formatCurrency(maxAmount)));
					} else if (!object.isAmountPositive()) {
						message("must be a positive number");
					} else {
						try {
							var v = Balanced.Utils.dollarsToCents(value);
							if (isNaN(v) || v <= 0) {
								message("must be a positive number");
							}
						} catch (e) {
							message(e.message.replace("Error: ", ""));
						}
					}
				}
			}
		}
	},

	maxReversalAmountDollars: Ember.computed.oneWay("credit.max_reversal_amount_dollars"),

	dollar_amount: function() {
		return this.get("maxReversalAmountDollars");
	}.property(),

	save: function() {
		this.validate();
		if (this.get("isValid")) {
			return Balanced.Reversal.create({
				uri: this.get('credit.reversals_uri'),
				credit_uri: this.get('credit.uri'),
				amount: this.get("amount")
			}).save().then(function(reversal) {
				return reversal;
			});
		} else {
			return Ember.RSVP.reject();
		}
	}
});
