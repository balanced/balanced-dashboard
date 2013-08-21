Balanced.Credit = Balanced.Transaction.extend({
    bank_account: Balanced.Model.belongsTo('bank_account', 'Balanced.BankAccount'),

    type_name: function () {
        return "Credit";
    }.property(),

    funding_instrument_description: function () {
        return this.get('bank_account.description');
    }.property('bank_account.description'),

    serialize: function (json) {
        this._super(json);

        if (this.get('bank_account')) {
            json.bank_account = this.get('bank_account')._toSerializedJSON();
        }
    }
});

Balanced.TypeMappings.addTypeMapping('credit', 'Balanced.Credit');
