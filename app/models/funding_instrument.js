Balanced.FundingInstrument = Balanced.Model.extend({
    customer: Balanced.Model.belongsTo('customer', 'Balanced.Customer'),

    title_description: function () {
        return '{0} ({1})'.format(
            this.get('name'),
            this.get('last_four')
        );
    }.property('name', 'last_four'),
});
