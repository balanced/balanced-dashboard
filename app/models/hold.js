Balanced.Hold = Balanced.Transaction.extend({
    source: Balanced.Model.belongsTo('source', 'Balanced.FundingInstrument'),
    debit: Balanced.Model.belongsTo('debit', 'Balanced.Debit'),

    hold_status: function() {
        return this.get('is_void') ? "void" : "created";
    }.property('is_void'),

    can_void_or_capture: function() {
        return this.get('hold_status') === 'created' && !this.get('debit');
    }.property('hold_status', 'debit'),

    type_name: function () {
        return "Hold";
    }.property(),

    funding_instrument_description: function () {
        return this.get('source.description');
    }.property('source.description')
});

Balanced.TypeMappings.addTypeMapping('hold', 'Balanced.Hold');
