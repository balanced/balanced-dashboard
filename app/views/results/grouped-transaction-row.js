import Ember from "ember";
import Computed from "balanced-dashboard/utils/computed";
import LinkedTwoLinesCellView from "../tables/cells/linked-two-lines-cell";
import Utils from "balanced-dashboard/lib/utils";

var GroupedTransactionRowView = LinkedTwoLinesCellView.extend({
	tagName: 'tr',
	templateName: 'results/grouped-transaction-row',
	routeName: Ember.computed.oneWay("item.route_name"),
	spanClassNames: Ember.computed.oneWay("item.status"),

	title: function() {
		var description = this.get("item.description");

		if (description) {
			return description;
		}
		if (_.contains(this.get("classNames"), "current")) {
			return 'You are currently viewing this transaction.';
		}
		return '(Created at %@)'.fmt(this.get("secondaryLabelText"));
	}.property("item.description", "primaryLabelText", "secondaryLabelText"),

	primaryLabelText: function() {
		if (_.contains(this.get("classNames"), "current")) {
			return '%@ (currently viewing)'.fmt(this.get('item.type_name'));
		}
		var status = Utils.capitalize(this.get('item.status')).toLowerCase();

		var description = this.get('item.description') || '<span class="sl-none">(no description)</span>';
		var transactionText = '%@ %@ for %@'.fmt(this.get('item.type_name'), status, description);

		if (this.get('item.type_name') === 'Dispute') {
			transactionText = '%@ %@'.fmt(this.get('item.type_name'), status);
		}

		return Utils.safeFormat(transactionText).htmlSafe();
	}.property('classNames', 'item.type_name', 'item.status', 'item.description'),

	secondaryLabelText: function () {
		return Utils.humanReadableDateTime(this.get('item.created_at'));
	}.property('item.created_at'),

	paymentMethodText: function() {
		var label = '<span class="primary">%@</span><span class="secondary">%@</span>';
		var secondaryLabel = this.get('paymentMethodSecondaryLabelText') || '';
		return Utils.safeFormat(label, this.get('paymentMethodPrimaryLabelText'), secondaryLabel).htmlSafe();
	}.property('paymentMethodPrimaryLabelText', 'paymentMethodSecondaryLabelText'),

	paymentMethodPrimaryLabelText: Computed.fmt('item.last_four', 'item.brand', '%@ %@'),
	paymentMethodSecondaryLabelText: Ember.computed.reads('item.funding_instrument_type'),

	amountText: function() {
		return Utils.formatCurrency(this.get("item.amount"));
	}.property("item.amount")
});

export default GroupedTransactionRowView;
