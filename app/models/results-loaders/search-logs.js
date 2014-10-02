import Ember from "ember";
import LogsResultsLoader from "./logs";
import ModelArray from "../core/model-array";
import SearchModelArray from "../core/search-model-array";

var SearchLogsResultsLoader = LogsResultsLoader.extend({
	queryStringArguments: {},

	path: function() {
		return '/logs/%@'.fmt(this.get('query'));
	}.property('query'),

	results: function() {
		var query = this.get('query');
		var uri = this.get('resultsUri');
		var type = this.get('resultsType');

		if (Ember.isBlank(query) || query.indexOf('OHM') !== 0) {
			return ModelArray.create({
				isLoaded: true
			});
		}

		var searchArray = SearchModelArray.newArrayLoadedFromUri(uri, type);
		searchArray.then(function() {}, function() {
			searchArray.set('isLoaded', true);
		});

		return searchArray;
	}.property("query", "resultsUri", "resultsType"),
});

export default SearchLogsResultsLoader;
