var TabView = Ember.View.extend({
	templateName: "detail-views/tab",
	isSelected: false,

	toggleSelected: function(tabLink) {
		var tabs = this.get("tabs");
		tabs.map(function(tab) {
			tab.set("isSelected", false);
		});

		tabLink.set("isSelected", true);
	}
});

export default TabView;
