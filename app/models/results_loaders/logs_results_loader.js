require("app/model/log");
Balanced.LogsResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.Log,
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

Balanced.SearchLogsResultsLoader = Balanced.LogsResultsLoader.extend({
	queryStringArguments: {},

	path: function() {
		return '/logs/%@'.fmt(this.get('query'));
	}.property('query'),

	results: function() {
		var query = this.get('query');
		var uri = this.get('resultsUri');
		var type = this.get('resultsType');

		if (Ember.isBlank(query) || query.indexOf('OHM') !== 0) {
			return Balanced.ModelArray.create({
				isLoaded: true
			});
		}

		var searchArray = Balanced.SearchModelArray.newArrayLoadedFromUri(uri, type);
		searchArray.then(function() {}, function() {
			searchArray.set('isLoaded', true);
		});

		return searchArray;
	}.property("query", "resultsUri", "resultsType"),
});
