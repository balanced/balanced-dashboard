import Ember from "ember";

var LinkedCardView = Ember.View.extend({
	tagName: "div",
	templateName: "tables/cells/linked-card",
	classNameBindings: [":card", ":col-md-3", "item.isOverdue:overdue"],
	// title: Ember.computed.oneWay("title")
});

export default LinkedCardView;
