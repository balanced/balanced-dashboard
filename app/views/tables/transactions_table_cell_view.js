require("./table_cell_base_view");

Balanced.LinkedTransactionCellView = Balanced.LinkedTextCellView.extend({
	routeName: Ember.computed.oneWay("item.route_name"),
});

Balanced.TransactionCustomerCellView = Balanced.LinkedTwoLinesCellView.extend({
	routeName: Ember.computed.oneWay("item.route_name"),
	title: Ember.computed.oneWay("item.customer_name_summary"),
	classNameBindings: [":account", "item.customer::null-field"],
	primaryLabelText: Ember.computed.oneWay("item.customer_display_me"),
	secondaryLabelText: Ember.computed.oneWay("item.customer_email"),
	isBlank: Ember.computed.none('primaryLabelText', 'secondaryLabelText')
});

Balanced.TransactionAmountCellView = Balanced.LinkedTransactionCellView.extend({
	classNameBindings: [":amount", ":num"],
	labelText: function() {
		return Balanced.Utils.formatCurrency(this.get("item.amount"));
	}.property("item.amount"),
});
