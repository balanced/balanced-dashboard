import TransactionFactory from "./transaction-factory";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";

var HoldExistingFundingInstrumentTransactionFactory = TransactionFactory.extend({
	source_uri: Ember.computed.readOnly("source.uri"),
	getHoldAttributes: function() {
		var properties = this.getProperties("amount", "description", "source_uri");
		properties.uri = this.get("source.card_holds_uri");
		return properties;
	},

	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount
	},

	save: function() {
		var Hold = BalancedApp.__container__.lookupFactory("model:hold");
		var deferred = Ember.RSVP.defer();

		var baseHoldAttributes = this.getHoldAttributes();
		this.validate();
		if (this.get("isValid")) {
			Hold.create(this.getHoldAttributes())
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

export default HoldExistingFundingInstrumentTransactionFactory;
