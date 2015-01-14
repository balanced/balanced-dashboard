import Ember from "ember";
import Computed from "balanced-dashboard/utils/computed";
import ModelArray from "./model-array";

var readOnly = function(type) {
	return Ember.computed.readOnly('counts.' + type);
};

var SearchModelArray = ModelArray.extend(Ember.SortableMixin, {
	total_credits: readOnly('credit'),
	total_debits: readOnly('debit'),
	total_card_holds: readOnly('card_hold'),
	total_refunds: readOnly('refund'),
	total_customers: readOnly('customer'),
	total_bank_accounts: readOnly('bank_account'),
	total_cards: readOnly('card'),
	total_orders: readOnly('order'),
	total_disputes: readOnly('dispute'),
	total_reversals: readOnly("reversal"),
	total_transactions: Computed.sumAll('total_credits', 'total_debits', 'total_card_holds', 'total_refunds', "total_reversals"),
	total_funding_instruments: Computed.sumAll('total_bank_accounts', 'total_cards'),
	total_results: Computed.sumAll('total_orders', 'total_transactions', 'total_funding_instruments', 'total_customers')
});

export default SearchModelArray;
