Balanced.Account = Balanced.Model.extend({
    bank_accounts: Balanced.Model.hasMany('Balanced.BankAccount', 'bank_accounts_uri'),
    cards: Balanced.Model.hasMany('Balanced.Card', 'cards_uri'),

    customer: Balanced.Model.belongsTo('Balanced.Customer', 'customer_uri'),

    web_uri: function() {
        return Balanced.MigrationUtils.convertApiUriIntoWebUri(this.get('uri'));
    }.property('uri'),

    embedded_iframe_url: function() {
        return this.get('web_uri') + Balanced.MigrationUtils.embeddedQueryString();
    }.property('web_uri'),

    display_me: function () {
        return this.get('name') || this.get('id');
    }.property('name', 'id'),

    name_summary: function() {
        var builtString;
        if(this.get('name')) {
            builtString = this.get('name');
            if(this.get('email_address')) {
                builtString += " (" + this.get('email_address') + ")";
            }
        } else if(this.get('email_address')) {
            builtString = this.get('email_address');
        } else {
            builtString = this.get('id');
        }
        return builtString;
    }.property('name', 'email_address', 'id'),

    // compat with customers:
    email: function () {
        return this.get('email_address');
    }.property('email_address')
});

Balanced.TypeMappings.addTypeMapping('account', 'Balanced.Account');
