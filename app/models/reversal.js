require('app/models/transaction');

Balanced.Reversal = Balanced.Transaction.extend({
	credit: Balanced.Model.belongsTo('credit', 'Balanced.Credit'),
	type_name: 'Reversal',
	route_name: 'reversals'
});

Balanced.TypeMappings.addTypeMapping('reversal', 'Balanced.Reversal');
