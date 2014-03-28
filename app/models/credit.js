require('app/models/transaction');

Balanced.Credit = Balanced.Transaction.extend({
	reversal_amount: 0,
	uri: '/credits',
	type_name: "Credit",
	route_name: "credits",

	bank_account: Balanced.Model.belongsTo('destination', 'Balanced.BankAccount'),
	reversals: Balanced.Model.hasMany('reversals', 'Balanced.Reversal'),

	funding_instrument_description: Ember.computed.alias('bank_account.description'),
	max_reversal_amount_dollars: Balanced.computed.transform('reversal_amount', Balanced.Utils.centsToDollars),

	get_reversals: function() {
		var self = this;
		this.get('reversals').then(function(reversals) {
			self.set('reversal_amount', reversals.reduce(function(amount, reversal) {
				if (!reversal.get('is_failed')) {
					return amount + reversal.get('amount');
				} else {
					return amount;
				}
			}, 0));
		});
	}.on('didLoad'),

	can_reverse: function() {
		return (!this,get('is_failed')) && this.get('reversals.isLoaded') && this.get('reversals.length');
	}.property('is_failed', 'reversals.isLoaded', 'reversals.length'),

	status_description: function() {
		if (this.get('is_pending')) {
			return "Credit is processing, funds will be available the next business day unless there is an issue with the bank account.";
		} else if (this.get('is_succeeded')) {
			return "Funds are now available. If there is an issue with the bank account, a \"Failed\" status and rejection reason will be displayed here.";
		} else if (this.get('is_failed')) {
			if (this.get('failure_reason') || this.get('failure_reason_code')) {
				return this.get('failure_reason') || this.get('failure_reason_code');
			}
			return "Update the customer account with corrected bank account information. Then resubmit the credit.";
		} else {
			return undefined;
		}
	}.property('is_pending', 'is_succeeded', 'is_failed', 'failure_reason', 'failure_reason_code'),
});

Balanced.TypeMappings.addTypeMapping('credit', 'Balanced.Credit');

Balanced.Credit.reopenClass({
	serializer: Balanced.Rev1Serializer.extend({
		serialize: function(record) {
			var json = this._super(record);

			var bankAccount = record.get('bank_account');
			if (bankAccount) {
				json.bank_account = bankAccount.constructor.serializer.serialize(bankAccount);
			}

			return json;
		}
	}).create(),
});
