require("./table_cell_base_view");

Balanced.LogsTableCellView = Balanced.LinkedTextCellView.extend({
	routeName: "logs.log",
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
	labelText: function() {
		var status = this.get("item.message.response.status");
		var statusClass = status.match(/2\d\d/) ? 'ok' : 'error';
		return new Ember.Handlebars.SafeString(
			'<span class="status-%@">%@</span>'.fmt(statusClass, status)
		);
	}.property("item.message.response.status")
});
