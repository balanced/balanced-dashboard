import Ember from "ember";
import LinkedTwoLinesCellView from "./cells/linked-two-lines-cell";
import Utils from "balanced-dashboard/lib/utils";

var GroupedTransactionRowView = LinkedTwoLinesCellView.extend({
	tagName: 'tr',
	templateName: 'tables/grouped-transaction-row',
	routeName: Ember.computed.oneWay("item.route_name"),
	title: Ember.computed.oneWay("item.customer_name_summary"),
	spanClassNames: Ember.computed.oneWay("item.status"),
	primaryLabelText: function() {
		return '%@ %@ on %@ %@'.fmt(this.get('item.type_name'), this.get('item.status'), this.get('item.last_four'), Utils.toLowerCase(this.get('item.funding_instrument_type')));
	}.property('item.type_name', 'item.status', 'item.last_four', 'item.funding_instrument_type'),

	secondaryLabelText: function () {
		return Utils.humanReadableDateLong(this.get('item.created_at'));
	}.property('item.created_at'),

	amountText: function() {
		return Utils.formatCurrency(this.get("item.amount"));
	}.property("item.amount")
});

export default GroupedTransactionRowView;
