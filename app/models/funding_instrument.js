Balanced.FundingInstrument = Balanced.Model.extend({
    customer: Balanced.Model.belongsTo('customer', 'Balanced.Customer'),

    title_description: function () {
        return '%@ (%@)'.fmt(
            this.get('name'),
            this.get('last_four')
        );
    }.property('name', 'last_four'),

    description_with_type: function () {
        return '%@: %@'.fmt(this.get('type_name'), this.get('description'));
    }.property('description'),
});
