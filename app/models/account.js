Balanced.Account = Balanced.Model.extend({
    web_uri: function() {
        return Balanced.MigrationUtils.convertApiUriIntoWebUri(this.get('uri'));
    }.property('uri'),

    embedded_iframe_url: function() {
        return this.get('web_uri') + Balanced.MigrationUtils.EMBEDDED_QUERY_APPEND;
    }.property('web_uri')
});

Balanced.Account.find = function(uri) {
    var account = Balanced.Account.create({uri: uri});
    Balanced.Model.ajax(ENV.BALANCED.API + uri, "GET").then(function(json) {
        account.setProperties(json);
    });
    return account;
};
