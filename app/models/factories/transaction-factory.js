import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";
import Utils from "balanced-dashboard/lib/utils";

var TransactionFactory = Ember.Object.extend(Ember.Validations, {
	isAmountPositive: function() {
		return this.get("amount") > 0;
	},

	amount: function() {
		try {
			return "" + Utils.dollarsToCents("" + this.get('dollar_amount'));
		} catch (e) {
			return undefined;
		}
	}.property("dollar_amount"),

	validateAndSave: function() {
		this.validate();
		if (this.get("isValid")) {
			return this.save();
		} else {
			return Ember.RSVP.reject();
		}
	}
});

export default TransactionFactory;
