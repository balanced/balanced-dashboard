Balanced.Reversal = Balanced.Transaction.extend({
    credit: Balanced.Model.belongsTo('Balanced.Credit', 'credit'),

    type_name: function () {
        return "Reversal";
    }.property()
});

Balanced.TypeMappings.addTypeMapping('reversal', 'Balanced.Reversal');
