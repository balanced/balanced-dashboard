Balanced.SidebarItemView = Ember.View.extend({
	tagName: "li",
	classNameBindings: ["isSelected:menu-active"],
	hasIcon: Ember.computed.gt("linkIcon.length", 0),

	children: function() {
		return [];
	}.property(),

	childViewItems: function() {
		return this.get("children").map(function(child) {
			return Balanced.BasicLinkSidebarItemView.create(child);
		});
	}.property("children.@each"),

	getRoute: function(routeName, model) {
		var router = Balanced.Router.router;
		return router.generate.apply(router, arguments);
	},
});

Balanced.BasicLinkSidebarItemView = Balanced.SidebarItemView.extend({
	templateName: "sidebar/basic_link_sidebar_item",
	linkText: "Marketplaces",
	linkIcon: "icon-activity",

	href: function() {
		return "#" + this.getRoute(this.get("routeName"));
	}.property("routeName"),

	isCurrent: function() {
		var currentRouteName = Balanced.Router.router.currentHandlerInfos.get("lastObject.handler.routeName");
		return this.get("routeName") === currentRouteName;
	}.property("href")
});
