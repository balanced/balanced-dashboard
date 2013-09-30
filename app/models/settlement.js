require('app/models/transaction');

Balanced.Settlement = Balanced.Transaction.extend({
	debit: Balanced.Model.belongsTo('debit', 'Balanced.Debit'),

	type_name: function() {
		return "settlement";
	}.property(),

	route_name: function() {
		return "Settlement";
	}.property()
});

Balanced.TypeMappings.addTypeMapping('settlement', 'Balanced.Settlement');
