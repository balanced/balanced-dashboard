import Ember from "ember";

var SidebarView = Ember.View.extend({
	items: function() {
		return [];
	}.property(),
	dropdownDisplayLabel: function() {
		return this.get("marketplace") ?
			this.get("marketplace.name") :
			"Marketplaces";
	}.property("marketplace", "marketplace.name"),
});

export default SidebarView;
