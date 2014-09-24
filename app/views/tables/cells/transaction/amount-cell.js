import Ember from "ember";
import LinkedTextCellView from "../linked-text-cell";
import Utils from "balanced-dashboard/lib/utils";

var AmountCellView = LinkedTextCellView.extend({
	routeName: Ember.computed.oneWay("item.route_name"),
	classNameBindings: [":amount", ":num"],
	labelText: function() {
		return Utils.formatCurrency(this.get("item.amount"));
	}.property("item.amount"),
});

export default AmountCellView;
