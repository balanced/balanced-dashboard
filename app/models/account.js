Balanced.Account = Balanced.Model.extend({
    bank_accounts: Balanced.Model.hasMany('bank_accounts', 'Balanced.BankAccount'),
    cards: Balanced.Model.hasMany('cards', 'Balanced.Card'),

    customer: Balanced.Model.belongsTo('customer', 'Balanced.Customer'),

    web_uri: function () {
        return Balanced.MigrationUtils.convertApiUriIntoWebUri(this.get('uri'));
    }.property('uri'),

    embedded_iframe_url: function () {
        return this.get('web_uri') + Balanced.MigrationUtils.embeddedQueryString();
    }.property('web_uri'),

    display_me: function () {
        return this.get('name') || this.get('id');
    }.property('name', 'id'),

    name_summary: function () {
        var builtString;
        var name = this.get('name'),
            emailAddress =this.get('email_address');
        if (name) {
            builtString = name;
            if (emailAddress) {
                builtString += ' (' + emailAddress + ')';
            }
        } else {
            if (emailAddress) {
                builtString = emailAddress;
            } else {
                builtString = this.get('id');
            }
        }
        return builtString;
    }.property('name', 'email_address', 'id'),

    // compat with customers:
    email: function () {
        return this.get('email_address');
    }.property('email_address')

});

Balanced.TypeMappings.addTypeMapping('account', 'Balanced.Account');
