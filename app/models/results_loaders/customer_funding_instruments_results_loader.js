Balanced.CustomerFundingInstrumentsResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.FundingInstrument,
	results: function() {
		var type = this.get("type");
		var customer = this.get("customer");

		var mappings = {
			card: "cards",
			bank_account: "bank_accounts"
		};

		type = mappings[type] || "funding_instruments";
		return customer.get(type);
	}.property("customer", "type")
});
