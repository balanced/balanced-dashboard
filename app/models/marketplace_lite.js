Balanced.MarketplaceLite = Balanced.Model.extend({
    web_uri: function() {
        // have to strip off the API version
        return ENV.BALANCED.WWW + this.get('uri').substring(3);
    }.property('uri'),

    embedded_iframe_url: function() {
        return this.get('web_uri') + "?embedded=1";
    }.property('web_uri'),

    activity_embedded_iframe_url: function() {
        return this.get('web_uri') + "/transactions?embedded=1";
    }.property('web_uri'),

    invoices_embedded_iframe_url: function() {
        return this.get('web_uri') + "/invoices?embedded=1";
    }.property('web_uri'),

    logs_embedded_iframe_url: function() {
        return this.get('web_uri') + "/logs?embedded=1";
    }.property('web_uri')
});
