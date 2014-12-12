import Ember from "ember";
import GroupedTransactionRowView from "./grouped-transaction-row";
import Utils from "balanced-dashboard/lib/utils";

var GroupedOrderRowView = GroupedTransactionRowView.extend({
	spanClassNames: "order",

	title: function() {
		return this.get('item.description') || this.get('item.id');
	}.property('item.description', 'item.id'),

	primaryLabelText: function() {
		var description = this.get('item.description') || this.get('item.id');
		return '%@: %@'.fmt(this.get('item.type_name'), description);
	}.property('item.type_name', 'item.description', 'item.id'),

	secondaryLabelText: function () {
		return Utils.humanReadableDateTime(this.get('item.created_at'));
	}.property('item.created_at'),

	amountText: Ember.computed.oneWay("item.escrow_balance")
});

export default GroupedOrderRowView;
