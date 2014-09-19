import Ember from "ember";
Balanced.ResourceLogsView = Ember.View.extend({
	templateName: 'resource_logs',
	results: Ember.computed.oneWay("resultsLoader.results"),
	resultsLoader: function() {
		var content = this.get("content");
		return Balanced.LogsResultsLoader.create({
			limit: 5,
			resource: content,
		});
	}.property("content"),
});
