import Ember from "ember";
import Model from "./core/model";
import Transaction from "./transaction";

var Refund = Transaction.extend({
	debit: Model.belongsTo('debit', 'debit'),
	dispute: Model.belongsTo('dispute', 'dispute'),

	type_name: 'Refund',
	route_name: 'refunds',
	funding_instrument_description: Ember.computed.readOnly('debit.funding_instrument_description'),
	customer: Ember.computed.readOnly('debit.customer'),
	last_four: Ember.computed.readOnly('debit.last_four'),
	funding_instrument_name: Ember.computed.readOnly('debit.funding_instrument_name'),
	funding_instrument_type: Ember.computed.alias('debit.funding_instrument_type'),

	refunds_without_current: function() {
		var currentModelId = this.get('id');
		var refunds = this.get('debit.refunds.content');
		return _.filter(refunds, function(refund) {
			return refund.get('id') !== currentModelId;
		});
	}.property('id', 'debit.refunds.@each')
});

export default Refund;
