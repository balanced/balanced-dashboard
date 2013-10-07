var attr = DS.attr;
var hasMany = DS.hasMany;
var belongsTo = DS.belongsTo;

Balanced.BankAccountModel = DS.Model.extend({

	name: attr('string'),
	fingerprint: attr('string'),
	account_number: attr('string'),
	routing_number: attr('number'),
	bank_name: attr('string'),
	account_type: attr('string'),
	can_credit: attr('boolean'),
	can_debit: attr('boolean'),
	created_at: attr('string'),
	updated_at: attr('string'),
	customer: belongsTo('customer_model', {inverse: 'bank_accounts'}),

	last_four: function() {
		var accountNumber = this.get('account_number');
		if (!accountNumber || accountNumber.length < 5) {
			return accountNumber;
		} else {
			return accountNumber.substr(accountNumber.length - 4, 4);
		}
	}.property('account_number'),

	description: function() {
		if (this.get('bank_name')) {
			return '%@ (%@)'.fmt(
				this.get('last_four'),
				Balanced.Utils.toTitleCase(this.get('bank_name'))
			);
		} else {
			return this.get('last_four');
		}
	}.property('last_four', 'bank_name'),

	// hack to make the association two-way
	didLoad: function() {
		var self = this;
		this.get('customer.bank_accounts').then(function(accounts) {
			accounts.pushObject(self);
		});
	}

});
