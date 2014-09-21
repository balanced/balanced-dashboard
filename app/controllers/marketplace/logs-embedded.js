import MarketplaceLogsController from "./logs";

/*
	This controller provides embedded log records in resource pages
*/
var LogsEmbeddedController = Balanced.MarketplaceLogsController.extend({
	resultsLoader: function() {
		var marketplace = this.modelFor("marketplace");
		return Balanced.LogsResultsLoader.create({
			limit: 5,
			resource: this.get("model"),
			marketplace: marketplace
		});
	}.property(),
});

export default LogsEmbeddedController;
