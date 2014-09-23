import Computed from "balanced-dashboard/utils/computed";
Balanced.Event = Balanced.Model.extend({
	transaction: Balanced.Model.belongsTo('entity', 'transaction'),
	eventCallbacks: Balanced.Model.hasMany('callbacks', 'event-callback'),
	uri: '/events',
	route_name: 'events',
	page_title: Computed.fmt('type', 'id', '%@ #%@'),
	status: function() {
		return this.get('type').split('.')[1];
	}.property('type')
});

export default Balanced.Event;
