import MarketplaceLogsController from "./logs";
import LogsResultsLoader from "balanced-dashboard/models/results-loaders/logs";

/*
	This controller provides embedded log records in resource pages
*/
var LogsEmbeddedController = MarketplaceLogsController.extend({
	resultsLoader: function() {
		var marketplace = this.modelFor("marketplace");
		return LogsResultsLoader.create({
			limit: 5,
			resource: this.get("model"),
			marketplace: marketplace
		});
	}.property(),
});

export default LogsEmbeddedController;
