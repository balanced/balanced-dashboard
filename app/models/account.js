Balanced.Account = Balanced.Model.extend({
    web_uri: function() {
        return Balanced.MigrationUtils.convertApiUriIntoWebUri(this.get('uri'));
    }.property('uri'),

    embedded_iframe_url: function() {
        return this.get('web_uri') + Balanced.MigrationUtils.EMBEDDED_QUERY_APPEND;
    }.property('web_uri'),

    display_me: function () {
        return this.get('name') || this.get('id');
    }.property('name', 'id'),

    // compat with customers:
    email: function () {
        return this.get('email_address');
    }.property('email_address')
});
