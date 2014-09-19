import ResultsLoader from "./results-loader";
import Hold from "balanced-dashboard/models/hold";
import Debit from "balanced-dashboard/models/debit";

var DisputeTransactionsResultsLoader = ResultsLoader.extend({
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

		var results = Balanced.SearchModelArray.newArrayLoadedFromUri(refundsUri, Balanced.Refund);
		results.pushObjects(content);

		return results;
	}.property("hold", "debit", "dispute.transaction.refunds_uri"),
});

export default DisputeTransactionsResultsLoader;
