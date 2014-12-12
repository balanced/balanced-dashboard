import Ember from "ember";
import LinkedTwoLinesCellView from "../linked-two-lines-cell";

var CustomerCellView = LinkedTwoLinesCellView.extend({
	routeName: Ember.computed.oneWay("item.route_name"),
	title: Ember.computed.oneWay("item.customer_name_summary"),
	classNameBindings: [":account", "item.customer::null-field", ":two-lines"],
	primaryLabelText: Ember.computed.oneWay("item.customer_display_me"),
	secondaryLabelText: Ember.computed.oneWay("item.customer_email"),
});

export default CustomerCellView;
