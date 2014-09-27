import Ember from "ember";
import LogsResultsLoader from "../models/results-loaders/logs";

var ResourceLogsView = Ember.View.extend({
	templateName: 'resource-logs',
	results: Ember.computed.oneWay("resultsLoader.results"),
	resultsLoader: function() {
		var content = this.get("content");
		return LogsResultsLoader.create({
			limit: 5,
			resource: content,
		});
	}.property("content"),
});

export default ResourceLogsView;
