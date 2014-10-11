import TransactionFactory from "./transaction-factory";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";

var CaptureHoldTransactionFactory = TransactionFactory.extend({
	hold_uri: Ember.computed.readOnly("hold.uri"),
	getDebitAttributes: function() {
		var properties = this.getProperties("amount", "description", "hold_uri");
		properties.uri = this.get("hold.debits_uri");
		return properties;
	},

	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount
	},

	save: function() {
		var Debit = BalancedApp.__container__.lookupFactory("model:debit");
		var deferred = Ember.RSVP.defer();

		var baseDebitAttributes = this.getDebitAttributes();
		this.validate();
		if (this.get("isValid")) {
			Debit.create(this.getDebitAttributes())
				.save()
				.then(function(model) {
					deferred.resolve(model);
				}, function() {
					deferred.reject();
				});
		} else {
			deferred.reject();
		}

		return deferred.promise;
	}
});

export default CaptureHoldTransactionFactory;
