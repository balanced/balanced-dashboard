import SidePanelView from "./side-panel";
import Utils from "balanced-dashboard/lib/utils";

var ApiModelPanelView = SidePanelView.extend({
	panelTitle: function() {
		var createdAt = this.get("model.created_at");
		return Utils.humanReadableDateLong(createdAt);
	}.property("model.created_at")
});

export default ApiModelPanelView;
