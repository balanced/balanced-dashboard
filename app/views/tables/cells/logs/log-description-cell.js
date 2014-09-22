import Ember from "ember";
import LinkedTextCellView from "../linked-text-cell";

var LogDescriptionCellView = LinkedTextCellView.extend({
	routeName: Ember.computed.oneWay("item.route_name"),
	labelText: function() {
		return "%@ %@".fmt(
			this.get("item.message.request.method"),
			this.get("item.condensed_request_url")
		);
	}.property("item.condensed_request_url", "item.message.request.method"),
});

export default LogDescriptionCellView;
