require('app/models/transaction');

Balanced.Reversal = Balanced.Transaction.extend({
	credit: Balanced.Model.belongsTo('credit', 'Balanced.Credit'),

	type_name: function() {
		return "Reversal";
	}.property(),

	route_name: function() {
		return "reversals";
	}.property(),
});

Balanced.TypeMappings.addTypeMapping('reversal', 'Balanced.Reversal');
