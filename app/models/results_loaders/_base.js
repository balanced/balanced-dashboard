Balanced.ResultsLoader = Ember.Object.extend({
	limit: 50,
	sort: function() {
		return this.get("sortField") + "," + this.get("sortDirection");
	}.property("sortField", "sortDirection"),

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
		if (path === undefined) {
			return undefined;
		} else {
			return Balanced.Utils.buildUri(path, query);
		}
	}.property("path", "queryStringArguments"),

	queryString: function() {
		return Balanced.Utils.objectToQueryString(this.get("queryStringArguments"));
	}.property("queryStringArguments"),

	results: function() {
		var uri = this.get('resultsUri');
		var type = this.get('resultsType');
		if (Ember.isBlank(uri)) {
			return Balanced.ModelArray.create({
				isLoaded: true
			});
		} else {
			return Balanced.ModelArray.newArrayLoadedFromUri(uri, type);
		}
	}.property("resultsUri", "resultsType"),

	isLoading: Ember.computed.not("results.isLoaded"),

	queryStringArguments: function() {
		var queryStringBuilder = new Balanced.ResultsLoaderQueryStringBuilder();

		queryStringBuilder.addValues({
			limit: this.get("limit"),
			sort: this.get("sort"),

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
	}.property("sort", "startTime", "endTime", "typeFilters", "statusFilters", "endpointFilters", "statusRollupFilters", "limit"),


	isBulkDownloadCsv: function() {
		return !Ember.isBlank(this.getCsvExportType());
	},

	getCsvExportType: function() {
		var type = this.get("resultsType");
		if (type === Balanced.Dispute) {
			return "disputes";
		} else if (type === Balanced.Transaction) {
			return "transactions";
		} else if (type === Balanced.Invoice) {
			return "invoices";
		}
	},

	postCsvExport: function(emailAddress) {
		var downloadAttributes = {
			uri: "/v1" + this.get("resultsUri"),
			email_address: emailAddress
		};
		if (this.isBulkDownloadCsv()) {
			downloadAttributes = {
				email_address: emailAddress,
				beginning: this.get("startTime"),
				ending: this.get("endTime"),
				type: this.getCsvExportType()
			};
		}
		var download = Balanced.Download.create(downloadAttributes);
		return download.save();
	}
});
