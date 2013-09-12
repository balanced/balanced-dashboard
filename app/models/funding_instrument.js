Balanced.FundingInstrument = Balanced.Model.extend({
	customer: Balanced.Model.belongsTo('customer', 'Balanced.Customer'),

	title_description: function() {
		return '%@ (%@)'.fmt(
			this.get('name'),
			this.get('last_four')
		);
	}.property('name', 'last_four'),

	description_with_type: function() {
		return '%@: %@'.fmt(this.get('type_name'), this.get('description'));
	}.property('description'),

	// TODO - fix the API to return the transactions_uri, then get rid of this hack
	transactions_uri: function() {
		var id = this.get('id');
		if (!id) {
			return id;
		}
		return '/%@/%@/transactions'.fmt(this.get('route_name'), this.get('id'));
	}.property('id', 'route_name')
});
