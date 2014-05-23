Balanced.SidebarItemView = Ember.View.extend({
});

Balanced.BasicLinkSidebarItemView = Balanced.SidebarItemView.extend({
	templateName: "sidebar/basic_link_sidebar_item",
	linkText: "Marketplaces",
	linkIcon: "icon-activity",
	route: "marketplaces",
	model: undefined,
});
