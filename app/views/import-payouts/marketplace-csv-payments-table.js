import Ember from "ember";
import Utils from "balanced-dashboard/lib/utils";

var MarketplaceCsvPaymentsTableView = Ember.View.extend({
	templateName: "import-payouts/results-table",

	isExisting: Ember.computed.readOnly("creditCreators.isExistingCustomers"),

	isError: false,

	title: function() {
		var length = this.get("items.length");
		var validityAdjective = this.get("validityAdjective");
		var customersType = this.get("isExisting") ?
			"existing" :
			"new";

		var pattern = length === 1 ?
			"%@ %@ payout to %@ customers" :
			"%@ %@ payouts to %@ customers";
		return pattern.fmt(length, validityAdjective, customersType);
	}.property("items", "items.length", "isExisting", "validityAdjective"),

	errorReportUri: function() {
		var csv = this.get("creditCreators").toCsvString();
		return Utils.toDataUri(csv);
	}.property("creditCreators.length")
});

export default MarketplaceCsvPaymentsTableView;
