Balanced.Dispute = Balanced.Model.extend({
	transaction: Balanced.Model.belongsTo('transaction', 'Balanced.Transaction'),

	uri: '/disputes'
});

Balanced.TypeMappings.addTypeMapping('dispute', 'Balanced.Dispute');
