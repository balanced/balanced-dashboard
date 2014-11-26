import { defineFilter } from "balanced-dashboard/views/results/results-dropdown-filter";
import TabView from "./tab";

var OrderTabView = TabView.extend({
	tabs: function(){
		return [
			defineFilter("Charges", "charges", true),
			defineFilter("Payouts", "payouts"),
			defineFilter("Logs & Events", "logsEvents"),
		];
	}.property(),

	actions: {
		setTab: function(tabLink) {
			var model = this.get("model");
			model.set("selectedTab", tabLink.value);
			this.toggleSelected(tabLink);
		}
	}
});

export default OrderTabView;
