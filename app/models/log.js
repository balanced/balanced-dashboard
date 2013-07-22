Balanced.Log = Balanced.Model.extend({
    shortUrl: function() {
        return Balanced.Utils.stripDomain(this.get('url'));
    }.property('log.message.request.url'),

    condensedRequestUrl: function() {
        return Balanced.Utils.prettyLogUrl(this.get('url'));
    }.property('log.shortUrl')
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