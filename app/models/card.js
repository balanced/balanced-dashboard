Balanced.Card = Balanced.FundingInstrument.extend({
    type_name: function() {
        return 'Card';
    }.property(),

    is_bank_account: false,

    description: function () {
        return '{0} ({1})'.format(
            this.get('last_four'),
            Balanced.Utils.toTitleCase(this.get('brand'))
        );
    }.property('last_four', 'brand')
});

Balanced.TypeMappings.addTypeMapping('card', 'Balanced.Card');
