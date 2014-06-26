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

Balanced.LogStatusCellView = Balanced.LinkedTextCellView.extend({
	routeName: Ember.computed.oneWay("item.route_name"),
	classNameBindings: [":black"],
	isBlank: false,
	primaryLabelText: Ember.computed.oneWay('item.message.response.status'),
	secondaryLabelText: function() {
		if (this.get('item.message.response.body.errors')) {
			return this.get('item.message.response.body.errors.0.description');
		} else {
			return undefined;
		}
	}.property('item.message.response.body.errors.status'),

	spanClassNames: function() {
		return this.get('primaryLabelText').match(/2\d\d/) ? 'succeeded' : 'failed';
	}.property('labelText'),

	displayValue: function() {
		var label = '<span class="primary">%@</span><span class="secondary">%@</span>';
		return Balanced.Utils.safeFormat(label, this.get('primaryLabelText'), this.get('secondaryLabelText')).htmlSafe();
	}.property('primaryLabelText', 'secondaryLabelText'),

	title: function() {
		if (this.get('secondaryLabelText')) {
			return '%@ (%@)'.fmt(this.get('primaryLabelText'), this.get('secondaryLabelText'));
		} else {
			return this.get('primaryLabelText');
		}
	}.property('primaryLabelText', 'secondaryLabelText')
});
