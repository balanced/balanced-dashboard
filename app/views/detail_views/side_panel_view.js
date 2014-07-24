Balanced.SidePanelView = Balanced.View.extend({
	classNameBindings: [":side-panel", ":span8"],
	layoutName: "detail_views/side_panel_layout"
});

Balanced.ApiModelPanelView = Balanced.SidePanelView.extend({
	panelTitle: function() {
		var createdAt = this.get("model.created_at");
		return Balanced.Utils.humanReadableDateLong(createdAt);
	}.property("model.created_at")
});

Balanced.OrderPanelView = Balanced.ApiModelPanelView.extend({
	panelTitle: function() {
		var createdAt = this.get("model.transaction.created_at");
		return Balanced.Utils.humanReadableDateLong(createdAt);
	}.property("model.transaction.created_at")
});
