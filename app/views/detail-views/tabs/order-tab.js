import { defineFilter } from "balanced-dashboard/views/results/results-dropdown-filter";
import TabView from "./tab";

var OrderTabView = TabView.extend({
	tabs: function(){
		return [
			defineFilter("Activity", "activity", true),
			defineFilter("Logs & Events", "logsEvents"),
		];
	}.property(),

	actions: {
		setTab: function(tabLink) {
			if (tabLink.value === "activity") {
				this.get("parentView").setProperties({
					"isActivityTabSelected": true,
					"isLogsEventsTabSelected": false
				});
			} else if (tabLink.value === "logsEvents") {
				this.get("parentView").setProperties({
					"isActivityTabSelected": false,
					"isLogsEventsTabSelected": true
				});
			}

			this.toggleSelected(tabLink);
		}
	}
});

export default OrderTabView;
