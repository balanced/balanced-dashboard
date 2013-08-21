Balanced.Transaction = Balanced.Model.extend({
    account: Balanced.Model.belongsTo('account', 'Balanced.Account'),

    web_uri: function () {
        return Balanced.MigrationUtils.convertApiUriIntoWebUri(this.get('uri'));
    }.property('uri'),

    embedded_iframe_url: function () {
        return this.get('web_uri') + Balanced.MigrationUtils.embeddedQueryString();
    }.property('web_uri'),

    amount_dollars: function () {
        if (this.get('amount')) {
            return (this.get('amount') / 100).toFixed(2);
        } else {
            return '';
        }
    }.property('amount'),

    account_name_summary: function () {
        if (this.get('account')) {
            return this.get('account.name_summary');
        } else {
            return 'None';
        }
    }.property('account')
});
