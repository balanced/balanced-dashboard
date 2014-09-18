Balanced.Event = Balanced.Model.extend({
	transaction: Balanced.Model.belongsTo('entity', 'Balanced.Transaction'),
	eventCallbacks: Balanced.Model.hasMany('callbacks', 'Balanced.EventCallback'),
	uri: '/events',
	route_name: 'events',
	page_title: Balanced.computed.fmt('type', 'id', '%@ #%@'),
	status: function() {
		return this.get('type').split('.')[1];
	}.property('type')
});


