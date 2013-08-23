Balanced.Credit = Balanced.Transaction.extend({
    bank_account: Balanced.Model.belongsTo('bank_account', 'Balanced.BankAccount'),
    reversals: Balanced.Model.hasMany('reversals', 'Balanced.Reversal'),

    type_name: function () {
        return "Credit";
    }.property(),

    funding_instrument_description: function () {
        return this.get('bank_account.description');
    }.property('bank_account.description'),

    can_reverse: function() {
        return this.get('status') !== 'failed' && this.get('reversals.isLoaded') && this.get('reversals.content') && this.get('reversals.content').length === 0;
    }.property('status', 'reversals.isLoaded', 'reversals.@each'),

    serialize: function (json) {
        this._super(json);

        if (this.get('bank_account')) {
            json.bank_account = this.get('bank_account')._toSerializedJSON();
        }
    },

    status_description: function() {
        if(this.get('status') === 'pending') {
            return "Credit is processing, funds will be available the next business day unless there is an issue with the bank account.";
        } else if (this.get('status') === 'paid') {
            return "Funds are now available. If there is an issue with the bank account, a \"Failed\" status and rejection reason will be displayed here.";
        } else if (this.get('status') === 'failed') {
            return "Update the customer account with corrected bank account information. Then resubmit the credit.";
        } else {
            return undefined;
        }
    }.property('status')
});

Balanced.TypeMappings.addTypeMapping('credit', 'Balanced.Credit');
