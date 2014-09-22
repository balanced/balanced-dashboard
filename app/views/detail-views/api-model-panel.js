import SidePanelView from "./side-panel";

var ApiModelPanelView = SidePanelView.extend({
	panelTitle: function() {
		var createdAt = this.get("model.created_at");
		return Balanced.Utils.humanReadableDateLong(createdAt);
	}.property("model.created_at")
});

export default ApiModelPanelView;
