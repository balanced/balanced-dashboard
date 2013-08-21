Balanced.Refund = Balanced.Transaction.extend({
    debit: Balanced.Model.belongsTo('debit', 'Balanced.Debit'),

    type_name: function () {
        return "Refund";
    }.property(),

    funding_instrument_description: function () {
        // TODO - once we've gotten dynamic associations, use the funding_instrument_description from the debit
        return this.get('debit.account_name');
    }.property('debit.account_name')
});

Balanced.TypeMappings.addTypeMapping('refund', 'Balanced.Refund');
