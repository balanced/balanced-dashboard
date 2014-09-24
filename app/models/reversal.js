import Ember from "ember";
import Transaction from "./transaction";
import Model from "./core/model";

var Reversal = Transaction.extend({
	credit: Model.belongsTo('credit', 'credit'),

	type_name: 'Reversal',
	route_name: 'reversals',
	last_four: Ember.computed.readOnly('credit.last_four'),
	funding_instrument_name: Ember.computed.readOnly('credit.funding_instrument_name'),
	funding_instrument_description: Ember.computed.readOnly('credit.funding_instrument_description'),
	funding_instrument_type: Ember.computed.alias('credit.funding_instrument_type'),
	customer: Ember.computed.readOnly('credit.customer')
});

export default Reversal;
