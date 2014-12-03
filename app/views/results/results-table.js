import Ember from "ember";

var ResultsTableView = Ember.View.extend({
	tagName: 'table',
	classNames: 'items',

	eventTrackerText: function() {
		var templateName= this.get("templateName");

		return this.get("isSearch") ?
			"Clicked a row in %@ via search".fmt(templateName) :
			"Clicked a row in %@".fmt(templateName);
	}.property("isSearch", "templateName")
});

export default ResultsTableView;
