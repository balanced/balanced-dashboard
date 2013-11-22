Balanced.Transaction = Balanced.Model.extend({
	account: Balanced.Model.belongsTo('account', 'Balanced.Account'),
	customer: Balanced.Model.belongsTo('customer', 'Balanced.Customer'),
	events: Balanced.Model.hasMany('events', 'Balanced.Event'),

	amount_dollars: function() {
		if (this.get('amount')) {
			return (this.get('amount') / 100).toFixed(2);
		} else {
			return '';
		}
	}.property('amount'),

	customer_name_summary: function() {
		if (this.get('customer')) {
			return this.get('customer.display_me_with_email');
		} else {
			return 'None';
		}
	}.property('customer'),

	page_title: function() {
		return this.get('description') || this.get('id');
	}.property('description', 'id'),

	events_uri: function() {
		return this.get('uri') + '/events';
	}.property(),

	meta_array: function() {
		var meta = this.get('meta');
		if (!meta) {
			return meta;
		}

		var metaArray = [];

		for (var key in meta) {
			metaArray.push({
				key: key,
				value: meta[key]
			});
		}
		return metaArray;
	}.property('meta')
});
