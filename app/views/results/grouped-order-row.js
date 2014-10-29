import Ember from "ember";
import GroupedTransactionRowView from "./grouped-transaction-row";
import Utils from "balanced-dashboard/lib/utils";

var GroupedOrderRowView = GroupedTransactionRowView.extend({
	spanClassNames: "order",

	title: function() {
		var description = this.get("item.description");
		return description ? description : "No order description";
	}.property("item.description"),

	primaryLabelText: function() {
		return '%@: %@'.fmt(this.get('item.type_name'), this.get('item.description'));
	}.property('item.type_name', 'item.description'),

	secondaryLabelText: function () {
		return Utils.humanReadableDateTime(this.get('item.created_at'));
	}.property('item.created_at'),

	amountText: Ember.computed.oneWay("item.escrow_balance")
});

export default GroupedOrderRowView;
