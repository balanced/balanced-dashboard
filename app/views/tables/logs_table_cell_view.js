require("./table_cell_base_view");

Balanced.LogsTableCellView = Balanced.LinkedTextCellView.extend({
	routeName: Ember.computed.oneWay("item.route_name"),
});

Balanced.LogDescriptionCellView = Balanced.LogsTableCellView.extend({
	labelText: function() {
		return "%@ %@".fmt(
			this.get("item.message.request.method"),
			this.get("item.condensed_request_url")
		);
	}.property("item.condensed_request_url", "item.message.request.method"),
});

Balanced.LogStatusCellView = Balanced.LogsTableCellView.extend({
	classNameBindings: [":black"],
	labelText: Ember.computed.oneWay('item.message.response.status'),
	linkSpanClassNames: function() {
		return this.get('labelText').match(/2\d\d/) ? 'succeeded' : 'failed';
	}.property('labelText')
});
