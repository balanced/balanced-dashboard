import Transaction from "./transaction";
import Model from "./core/model";

var Settlement = Transaction.extend({
	debit: Model.belongsTo('debit', 'debit'),
	type_name: 'settlement',
	route_name: 'Settlement'
});

export default Settlement;
