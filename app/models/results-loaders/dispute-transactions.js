import BaseResultsLoader from "./base";
import SearchModelArray from "../core/search-model-array";
import Hold from "balanced-dashboard/models/hold";
import Debit from "balanced-dashboard/models/debit";
import Refund from "balanced-dashboard/models/refund";

var DisputeTransactionsResultsLoader = BaseResultsLoader.extend({
	hold: function() {
		var uri = this.get("dispute.transaction.hold_uri");
		return uri ? Hold.find(uri) : null;
	}.property("dispute.transaction.hold_uri"),

	debit: function() {
		var uri = this.get("dispute.transaction_uri");
		return uri ? Debit.find(uri) : null;
	}.property("dispute.transaction_uri"),

	results: function() {
		var refundsUri = this.get("dispute.transaction.refunds_uri");

		var content = [
			this.get("hold"),
			this.get("debit")
		].compact();

		var results = SearchModelArray.newArrayLoadedFromUri(refundsUri, Refund);
		results.pushObjects(content);
		return results;
	}.property("hold", "debit", "dispute.transaction.refunds_uri"),
});

export default DisputeTransactionsResultsLoader;
