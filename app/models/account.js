Balanced.Account = Balanced.Model.extend({
	bank_accounts: Balanced.Model.hasMany('bank_accounts', 'Balanced.BankAccount'),
	cards: Balanced.Model.hasMany('cards', 'Balanced.Card'),

	customer: Balanced.Model.belongsTo('customer', 'Balanced.Customer'),

	display_me: Balanced.computed.orProperties('name', 'id'),

	business_name: function() {
		return this.get('business_name');
	}.property('business_name'),

	// compat with customers:
	email: Ember.computed.alias('email_address'),

});

Balanced.TypeMappings.addTypeMapping('account', 'Balanced.Account');
