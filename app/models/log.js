Balanced.Log = Balanced.Model.extend({
	uri: '/logs',
	route_name: 'log',

	page_title: Balanced.computed.fmt('message.request.method', 'short_url', '%@ %@'),
	short_url: Balanced.computed.transform('message.request.url', Balanced.Utils.stripDomain),
	condensed_request_url: Balanced.computed.transform('short_url', Balanced.Utils.prettyLogUrl),
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
	category_code: Balanced.computed.orProperties('message.response.body.category_code', 'message.response.body.errors.0.category_code'),
	description: Balanced.computed.orProperties('message.response.body.description', 'message.response.body.errors.0.description'),

	geo_ip: function() {
		var ip = this.get('message.request.headers.X-Real-Ip');

		if (ip) {
			var self = this;

			Balanced.Utils.geoIP(ip, function(result) {
				self.set('geo_ip', result);
			});
		}
	}.property('message.request.headers.X-Real-Ip'),
});

Balanced.TypeMappings.addTypeMapping('log', 'Balanced.Log');
Balanced.TypeMappings.addTypeMapping('log_search', 'Balanced.Log');
