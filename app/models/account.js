Balanced.Account = Balanced.Model.extend({
    name: DS.attr('string'),
    uri: DS.attr('string'),

    web_uri: function() {
        return Balanced.MigrationUtils.convertApiUriIntoWebUri(this.get('uri'));
    }.property('uri'),

    embedded_iframe_url: function() {
        return this.get('web_uri') + Balanced.MigrationUtils.EMBEDDED_QUERY_APPEND;
    }.property('web_uri')
});

Balanced.Account.sync = {
    find: function(id, load) {
        Balanced.BasicAdapter.ajax(ENV.BALANCED.API + id, "GET").then(function(json) {
            load(DS.process(json));
        });
    }
};
