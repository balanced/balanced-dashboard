import Ember from "ember";
import Computed from "balanced-dashboard/utils/computed";
import Model from "./core/model";
import Utils from "balanced-dashboard/lib/utils";

var Log = Model.extend({
	uri: '/logs',
	route_name: 'log',
	type_name: 'Log',

	page_title: Computed.fmt('message.request.method', 'short_url', '%@ %@'),
	short_url: Computed.transform('message.request.url', Utils.stripDomain),
	condensed_request_url: Computed.transform('short_url', Utils.prettyLogUrl),
	status: function() {
		var status_code = this.get('status_rollup');
		if (status_code === '2XX') {
			return 'succeeded';
		} else if (status_code === '3XX' || status_code === '4XX') {
			return 'failed';
		}
	}.property('status_rollup'),

	status_code: Ember.computed.alias('message.response.status'),

	// Handling the difference between rev 1.0 and 1.1
	category_code: Computed.orProperties('message.response.body.category_code', 'message.response.body.errors.0.category_code'),
	description: Computed.orProperties('message.response.body.description', 'message.response.body.errors.0.description'),

	ip_address: function() {
		return "%@ %@".fmt(this.get("message.request.headers.X-Real-Ip"), this.get("geo_ip"))
	}.property("message.request.headers.X-Real-Ip", "geo_ip"),

	geo_ip: function() {
		var ip = this.get('message.request.headers.X-Real-Ip');

		if (ip) {
			var self = this;

			Utils.geoIP(ip, function(result) {
				self.set('geo_ip', result);
			});
		}
	}.property('message.request.headers.X-Real-Ip'),
});

export default Log;
