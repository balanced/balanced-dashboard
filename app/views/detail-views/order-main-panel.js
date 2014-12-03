import Ember from "ember";
import MainPanelView from "./main-panel";

var OrderMainPanelView = MainPanelView.extend({
	isChargesTabSelected: Ember.computed.equal("model.selectedTab", "charges"),
	isPayoutsTabSelected: Ember.computed.equal("model.selectedTab", "payouts"),
	isLogsEventsTabSelected: Ember.computed.equal("model.selectedTab", "logsEvents"),
});

export default OrderMainPanelView;
