require('app/models/core/model_array');

var readOnly = function(type) {
	return Ember.computed.readOnly('counts.' + type);
};

Balanced.SearchModelArray = Balanced.ModelArray.extend(Ember.SortableMixin, {
	total_credits: readOnly('credit'),
	total_debits: readOnly('debit'),
	total_card_holds: readOnly('card_hold'),
	total_refunds: readOnly('refund'),
	total_customers: readOnly('customer'),
	total_bank_accounts: readOnly('bank_account'),
	total_cards: readOnly('card'),
	total_orders: readOnly('order'),
	total_disputes: readOnly('dispute'),
	total_transactions: Balanced.computed.sumAll('total_credits', 'total_debits', 'total_card_holds', 'total_refunds'),
	total_funding_instruments: Balanced.computed.sumAll('total_bank_accounts', 'total_cards')
});
