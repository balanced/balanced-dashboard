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

	didLoad: function() {
		var self = this;
		this.get('customer.bank_accounts').then(function(accounts) {
			accounts.pushObject(self);
		});
	}

});
