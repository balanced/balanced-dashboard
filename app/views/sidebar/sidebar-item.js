import Ember from "ember";

var SidebarItemView = Ember.View.extend({
	tagName: "li",
	classNameBindings: ["isSelected:menu-active"],

	children: function() {
		return [];
	}.property(),

	childViewItems: function() {
		var childView = require("balanced-dashboard/views/sidebar/basic-link-sidebar-item")["default"];
		var container = this.container;
		return this.get("children").map(function(child) {
			return childView.extend(child);
		});
	}.property("children.@each"),

	getRoute: function(routeName, model) {
		var router = this.get("container").lookup("router:main");
		return router.generate.apply(router, arguments);
	},
});

export default SidebarItemView;
