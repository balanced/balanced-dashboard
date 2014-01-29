Balanced.Account = Balanced.Model.extend({
	bank_accounts: Balanced.Model.hasMany('bank_accounts', 'Balanced.BankAccount'),
	cards: Balanced.Model.hasMany('cards', 'Balanced.Card'),

	customer: Balanced.Model.belongsTo('customer', 'Balanced.Customer'),

	display_me: function() {
		return this.get('name') || this.get('id');
	}.property('name', 'id'),

	business_name: function() {
		return this.get('business_name');
	}.property('business_name'),

	name_summary: function() {
		var builtString;
		var name = this.get('name'),
			emailAddress = this.get('email_address');
		if (name) {
			builtString = name;
			if (emailAddress) {
				builtString += ' (' + emailAddress + ')';
			}
		} else {
			if (emailAddress) {
				builtString = emailAddress;
			} else {
				builtString = this.get('id');
			}
		}
		return builtString;
	}.property('name', 'email_address', 'id'),

	// compat with customers:
	email: function() {
		return this.get('email_address');
	}.property('email_address')

});

Balanced.TypeMappings.addTypeMapping('account', 'Balanced.Account');
