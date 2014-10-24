import Model from "./core/model";
import Computed from "balanced-dashboard/utils/computed";

var EventModel = Model.extend({
	transaction: Model.belongsTo('entity', 'transaction'),
	eventCallbacks: Model.hasMany('callbacks', 'event_callback'),
	uri: '/events',
	route_name: 'events',
	page_title: Computed.fmt('type', 'id', '%@ #%@'),
	status: function() {
		return this.get('type').split('.')[1];
	}.property('type')
});

export default EventModel;
