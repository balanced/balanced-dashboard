import Ember from "ember";

var SidePanelView = Ember.View.extend({
	classNameBindings: [":side-panel", ":span8"],
	layoutName: "detail-views/side-panel-layout"
});

export default SidePanelView;
