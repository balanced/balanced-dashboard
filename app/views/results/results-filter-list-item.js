import Ember from "ember";

var ResultsFilterListItemView = Ember.View.extend({
	templateName: "results/results-filter-list-item",
	tagName: "li",
	classNameBindings: ["isActive:selected", ":filter"],
	isActive: function() {
		var filterValue = this.get("filterValue");
		var currentValue = this.get("resultsLoader.type");
		return filterValue === currentValue;
	}.property("filterValue", "resultsLoader.type")
});

export default ResultsFilterListItemView;
