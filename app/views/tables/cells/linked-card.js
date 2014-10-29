import Ember from "ember";

var LinkedCardView = Ember.View.extend({
	tagName: "div",
	templateName: "tables/cells/linked-card",
	classNames: ["card", "col-md-3"],
	// title: Ember.computed.oneWay("title")
});

export default LinkedCardView;
