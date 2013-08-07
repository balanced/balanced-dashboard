Balanced.Log = Balanced.Model.extend({
    short_url: function() {
        return Balanced.Utils.stripDomain(this.get('message.request.url'));
    }.property('log.message.request.url'),

    condensed_request_url: function() {
        return Balanced.Utils.prettyLogUrl(this.get('short_url'));
    }.property('log.short_url'),

    human_readable_date: function() {
        if (this.get('created_at')) {
            return Date.parseISO8601(this.get('created_at')).strftime(this.date_formats.short);
        } else {
            return '';
        }
    }.property('log.created_at'),

    geo_ip: function() {
        var ip = this.get('message.request.headers.X-Real-Ip');

        if(ip) {
            var self = this;

            Balanced.Utils.geoIP(ip, function(result) {
                self.set('geo_ip', result);
            });
        }
    }.property('message.request.headers.X-Real-Ip'),
});

Balanced.Log.reopenClass({
    constructUri: function(id) {
        var uri = '/v1/logs';

        if(id) {
            return uri + '/' + id;
        }

        return uri;
    }
});

Balanced.TypeMappings.addTypeMapping('log', 'Balanced.Log');