require('app/models/store');

Balanced.MarketplaceLite = Balanced.Model.extend({
    name: DS.attr('string'),
    uri: DS.attr('string'),

    embedded_iframe_url: function() {
        return ENV.BALANCED.WWW + "/marketplaces/" + this.get('id') + "?embedded=1";
    }.property('id'),

    activity_embedded_iframe_url: function() {
        return ENV.BALANCED.WWW + "/marketplaces/" + this.get('id') + "/transactions?embedded=1";
    }.property('id'),

    invoices_embedded_iframe_url: function() {
        return ENV.BALANCED.WWW + "/marketplaces/" + this.get('id') + "/invoices?embedded=1";
    }.property('id'),

    logs_embedded_iframe_url: function() {
        return ENV.BALANCED.WWW + "/marketplaces/" + this.get('id') + "/logs?embedded=1";
    }.property('id')
});
