Balanced.ResultsFilterListItemView = Balanced.View.extend({
	templateName: "results/results_filter_list_item",
	tagName: "li",
	classNameBindings: ["isActive:selected", ":filter"],
	isActive: function() {
		var filterValue = this.get("filterValue");
		var currentValue = this.get("resultsLoader.type");
		return filterValue === currentValue;
	}.property("filterValue", "resultsLoader.type")
});
