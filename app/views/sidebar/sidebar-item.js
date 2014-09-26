import Ember from "ember";

var SidebarItemView = Ember.View.extend({
	tagName: "li",
	classNameBindings: ["isSelected:menu-active"],

	children: function() {
		return [];
	}.property(),

	childViewItems: function() {
		var container = this.container.lookupFactory("view:sidebar/basic-link-sidebar-item");
		return this.get("children").map(function(child) {
			return container.extend(child);
		});
	}.property("children.@each"),

	getRoute: function(routeName, model) {
		var router = this.get("container").lookup("router:main");
		return router.generate.apply(router, arguments);
	},
});

export default SidebarItemView;
