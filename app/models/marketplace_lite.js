Balanced.MarketplaceLite = Balanced.Model.extend({
    web_uri: function() {
        // have to strip off the API version
        return ENV.BALANCED.WWW + this.get('uri').substring(3);
    }.property('uri'),

    embedded_iframe_url: function() {
        return this.get('web_uri') + "?embedded=1";
    }.property('web_uri'),

    transactions_embedded_iframe_url: function() {
        return this.get('web_uri') + "/transactions?embedded=1";
    }.property('web_uri'),

    logs_embedded_iframe_url: function() {
        return this.get('web_uri') + "/logs?embedded=1";
    }.property('web_uri'),

    invoices_embedded_iframe_url: function() {
        return this.get('web_uri') + "/invoices?embedded=1";
    }.property('web_uri'),

    cards_embedded_iframe_url: function() {
        return this.get('web_uri') + "/cards?embedded=1";
    }.property('web_uri'),

    bankaccounts_embedded_iframe_url: function() {
        return this.get('web_uri') + "/bank_accounts?embedded=1";
    }.property('web_uri'),

    production: function () {
        return this.get('uri').indexOf('TEST') === -1;
    }.property('uri')

});
