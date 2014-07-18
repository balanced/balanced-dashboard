Balanced.ResultsLoader = Ember.Object.extend({
	limit: 50,
	sort: function() {
		return this.get("sortField") + "," + this.get("sortDirection");
	}.property("sortField", "sortDirection"),

	toggleSortDirection: function() {
		this.set("sortDirection", direction);
	},

	setSortField: function(field) {
		var oldValue = this.get("sortField");
		var direction = "desc";
		if (field === oldValue) {
			direction = this.get("sortDirection") === "asc" ?
				"desc" :
				"asc";
		}
		this.setProperties({
			sortDirection: direction,
			sortField: field
		});
	},

	sortDirection: "desc",
	sortField: "created_at",

	resultsUri: function() {
		var path = this.get("path");
		var query = this.get("queryStringArguments");
		return Balanced.Utils.buildUri(path, query);
	}.property("path", "queryStringArguments"),

	queryString: function() {
		return Balanced.Utils.objectToQueryString(this.get("queryStringArguments"));
	}.property("queryStringArguments"),

	results: function() {
		var uri = this.get('resultsUri');
		var type = this.get('resultsType');
		return Balanced.SearchModelArray.newArrayLoadedFromUri(uri, type);
	}.property("resultsUri", "resultsType"),

	queryStringArguments: function() {
		var queryStringBuilder = new Balanced.ResultsLoaderQueryStringBuilder();

		queryStringBuilder.addValues({
			limit: this.get("limit"),
			sort: this.get("sort"),
			offset: 0,

			type: this.get("typeFilters"),
			status: this.get("statusFilters"),
			method: this.get("methodFilters"),
			endpoint: this.get("endpointFilters"),
			status_rollup: this.get("statusRollupFilters"),

			"created_at[>]": this.get("startTime"),
			"created_at[<]": this.get("endTime"),

			q: this.get("searchQuery")
		});

		return queryStringBuilder.getQueryStringAttributes();
	}.property("sort", "startTime", "endTime", "typeFilters", "statusFilters", "endpointFilters", "statusRollupFilters", "limit")
});
