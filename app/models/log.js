Balanced.Log = Balanced.Model.extend({
	uri: '/logs',

	short_url: function() {
		return Balanced.Utils.stripDomain(this.get('message.request.url'));
	}.property('log.message.request.url'),

	condensed_request_url: function() {
		return Balanced.Utils.prettyLogUrl(this.get('short_url'));
	}.property('log.short_url'),

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
