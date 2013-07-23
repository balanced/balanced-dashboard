Balanced.Log = Balanced.Model.extend({
    short_url: function() {
        return Balanced.Utils.stripDomain(this.get('message.request.url'));
    }.property('log.message.request.url'),

    condensed_request_url: function() {
        return Balanced.Utils.prettyLogUrl(this.get('short_url'));
    }.property('log.short_url'),

    human_readable_date: function() {
        if (this.get('message.date')) {
            return Date.parseISO8601(this.get('message.date')).strftime(this.date_formats.short);
        } else {
            return '';
        }
    }.property('log.message.date')
});

Balanced.Log.reopenClass({
    constructUri: function(id) {
        if(id) {
            return '/v1/logs/' + id;
        } else {
            return '/v1/logs';
        }
    }
});

Balanced.TypeMappings.addTypeMapping('log', 'Balanced.Log');