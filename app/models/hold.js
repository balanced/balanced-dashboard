Balanced.Hold = Balanced.Transaction.extend({
    source: Balanced.Model.belongsTo('source', 'Balanced.FundingInstrument'),
    debit: Balanced.Model.belongsTo('debit', 'Balanced.Debit'),

    type_name: function () {
        return "Hold";
    }.property(),

    funding_instrument_description: function () {
        return this.get('source.description');
    }.property('source.description')
});

Balanced.TypeMappings.addTypeMapping('hold', 'Balanced.Hold');
