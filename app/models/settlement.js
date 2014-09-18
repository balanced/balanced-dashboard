Balanced.Settlement = Balanced.Transaction.extend({
	debit: Balanced.Model.belongsTo('debit', 'Balanced.Debit'),
	type_name: 'settlement',
	route_name: 'Settlement'
});


