import BaseResultsLoader from "./base";
import Log from "balanced-dashboard/models/log";

var LogsResultsLoader = BaseResultsLoader.extend({
	resultsType: Log,
	path: "/logs",
	methodFilters: ["post", "put", "delete"],
	queryStringArguments: function() {
		var attributes = this._super();

		if (this.get("resource.id")) {
			attributes.resource_id = this.get("resource.id");
		}
		return attributes;
	}.property("sort", "startTime", "endTime", "typeFilters", "statusFilters", "endpointFilters", "statusRollupFilters", "limit", "resource", "resource.id")
});

export default LogsResultsLoader;
