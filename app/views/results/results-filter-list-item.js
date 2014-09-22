import Ember from "ember";
Balanced.ResultsFilterListItemView = Ember.View.extend({
	templateName: "./results_filter_list_item",
	tagName: "li",
	classNameBindings: ["isActive:selected", ":filter"],
	isActive: function() {
		var filterValue = this.get("filterValue");
		var currentValue = this.get("resultsLoader.type");
		return filterValue === currentValue;
	}.property("filterValue", "resultsLoader.type")
});
