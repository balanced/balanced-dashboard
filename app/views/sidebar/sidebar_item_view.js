Balanced.SidebarItemView = Ember.View.extend({
	tagName: "li",

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
