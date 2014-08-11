Balanced.DisputeTransactionsResultsLoader = Balanced.ResultsLoader.extend({
	hold: function() {
		var uri = this.get("dispute.transaction.hold_uri");
		return uri ?
			Balanced.Hold.find(uri) : null;
	}.property("dispute.transaction.hold_uri"),

	debit: function() {
		var uri = this.get("dispute.transaction_uri");
		return uri ?
			Balanced.Debit.find(uri) : null;
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
