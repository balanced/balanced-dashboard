import Model from "./core/model";
import Computed from "balanced-dashboard/utils/computed";

var Event = Model.extend({
	transaction: Model.belongsTo('entity', 'transaction'),
	eventCallbacks: Model.hasMany('callbacks', 'event-callback'),
	uri: '/events',
	route_name: 'events',
	page_title: Computed.fmt('type', 'id', '%@ #%@'),
	status: function() {
		return this.get('type').split('.')[1];
	}.property('type')
});

export default Event;
