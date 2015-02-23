import Ember from "ember";
import TransactionFactory from "./transaction-factory";
import Utils from "balanced-dashboard/lib/utils";
import Refund from "balanced-dashboard/models/refund";
import ServerError from "balanced-dashboard/utils/error-handlers/validation-server-error-handler";

var RefundDebitTransactionFactory = TransactionFactory.extend({
	isAmountOverMaximum: function() {
		return this.get("amount") > this.get("debit.refund_amount");
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
						var maxAmount = object.get("debit.refund_amount");
						message("cannot be more than %@".fmt(Utils.formatCurrency(maxAmount)));
					} else if (!object.isAmountPositive()) {
						message("must be a positive number");
					} else {
						try {
							var v = Utils.dollarsToCents(value);
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

	maxAmountDollars: Ember.computed.oneWay("debit.max_refund_amount_dollars"),

	dollar_amount: function() {
		return this.get("maxAmountDollars");
	}.property(),

	setValidationErrorsFromServer: function(response) {
		var serverError = new ServerError(this, response);
		serverError.clear();
		serverError.execute();
	},

	save: function() {
		this.validate();
		var debit = this.get("debit");
		var self = this;
		if (this.get("isValid")) {
			return Refund.create({
				order: debit.get("order_uri"),
				uri: debit.get('refunds_uri'),
				debit_uri: debit.get('uri'),
				amount: this.get("amount"),
				description: this.get("description")
			}).save().then(function(refund) {
				return refund;
			}, function(response) {
				self.setValidationErrorsFromServer(response);
				return Ember.RSVP.reject(self);
			});
		} else {
			return Ember.RSVP.reject(this);
		}
	}
});

export default RefundDebitTransactionFactory;
