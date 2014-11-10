import Ember from "ember";
import LinkedTwoLinesCellView from "../tables/cells/linked-two-lines-cell";
import Utils from "balanced-dashboard/lib/utils";

var GroupedTransactionRowView = LinkedTwoLinesCellView.extend({
	tagName: 'tr',
	templateName: 'results/grouped-transaction-row',
	routeName: Ember.computed.oneWay("item.route_name"),
	spanClassNames: Ember.computed.oneWay("item.status"),

	title: function() {
		var description = this.get("item.description");
		var title = '%@ (Created at %@)'.fmt(this.get("primaryLabelText"), this.get("secondaryLabelText"));

		if (description) {
			title = description;
		} else if (_.contains(this.get("classNames"), "current")) {
			return 'You are currently viewing this transaction.';
		}

		return title;
	}.property("item.description", "primaryLabelText", "secondaryLabelText"),

	primaryLabelText: function() {
		if (_.contains(this.get("classNames"), "current")) {
			return '%@ (currently viewing)'.fmt(this.get('item.type_name'));
		}

		return '%@ %@ on %@ %@'.fmt(this.get('item.type_name'), this.get('item.status'), Utils.toLowerCase(this.get('item.funding_instrument_type')), this.get('item.last_four'));
	}.property('item.type_name', 'item.status', 'item.last_four', 'item.funding_instrument_type'),

	secondaryLabelText: function () {
		return Utils.humanReadableDateTime(this.get('item.created_at'));
	}.property('item.created_at'),

	amountText: function() {
		return Utils.formatCurrency(this.get("item.amount"));
	}.property("item.amount")
});

export default GroupedTransactionRowView;
