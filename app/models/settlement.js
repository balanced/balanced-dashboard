import Transaction from "./transaction";

var Settlement = Transaction.extend({
	debit: Balanced.Model.belongsTo('debit', 'Balanced.Debit'),
	type_name: 'settlement',
	route_name: 'Settlement'
});

export default Settlement;
