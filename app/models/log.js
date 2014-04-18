Balanced.Log = Balanced.Model.extend({
	uri: '/logs',
	page_title: Balanced.computed.fmt('message.request.method', 'short_url', '%@ %@'),
	short_url: Balanced.computed.transform('message.request.url', Balanced.Utils.stripDomain),
	condensed_request_url: Balanced.computed.transform('short_url', Balanced.Utils.prettyLogUrl),

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
