Balanced.FundingInstrumentsResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.FundingInstrument,
	typeFilters: ["funding_instrument", "bank_account", "card"],
	path: function() {
		return this.get("marketplace.uri") + "/search";
	}.property("marketplace.uri"),
});
