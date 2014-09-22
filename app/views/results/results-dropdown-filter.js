import Ember from "ember";

var ResultsDropdownFilterView = Ember.View.extend({
	templateName: "results/results-dropdown-filter",
	classNameBindings: [":dropdown", ":filter"],
	isSelected: false,

	toggleSelected: function(filterLink) {
		var filters = this.get("filters");

		filters.map(function(filter) {
			filter.set("isSelected", false);
		});

		filterLink.set("isSelected", true);

		if (filterLink.get('text') === "All") {
			this.set("isSelected", false);
		} else {
			this.set("isSelected", true);
		}
	},

	actions: {
		setFilter: function(filterLink) {
			var model = this.get("model");
			model.set(this.get("filter"), filterLink.value);
			this.toggleSelected(filterLink);
		}
	}
});

var defineFilter = function(text, value, isSelected) {
	return Ember.Object.create({
		value: value,
		text: text,
		isSelected: isSelected
	});
};

export default ResultsDropdownFilterView;
export { defineFilter };
