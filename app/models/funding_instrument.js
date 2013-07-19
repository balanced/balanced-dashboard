Balanced.FundingInstrument = Balanced.Model.extend({
    customer: Balanced.Model.belongsTo('Balanced.Customer', 'customer')
});
