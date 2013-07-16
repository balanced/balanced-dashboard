Balanced.Debit = Balanced.Transaction.extend({
    source: Balanced.Model.belongsTo('Balanced.FundingInstrument', 'source'),

    type_name: function () {
        return "Debit";
    }.property(),

    funding_instrument_description: function () {
        return this.get('source.description');
    }.property('source.description')
});

Balanced.TypeMappings.addTypeMapping('debit', 'Balanced.Debit');
