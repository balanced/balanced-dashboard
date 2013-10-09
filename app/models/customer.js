Balanced.Customer = Balanced.Model.extend({
	bank_accounts: Balanced.Model.hasMany('bank_accounts', 'Balanced.BankAccount'),
	cards: Balanced.Model.hasMany('cards', 'Balanced.Card'),
	transactions: Balanced.Model.hasMany('transactions', 'Balanced.Transaction'),
	debits: Balanced.Model.hasMany('debits', 'Balanced.Debit'),
	credits: Balanced.Model.hasMany('credits', 'Balanced.Credit'),
	holds: Balanced.Model.hasMany('holds', 'Balanced.Hold'),
	refunds: Balanced.Model.hasMany('refunds', 'Balanced.Refund'),

	debitable_bank_accounts: function() {
		var bank_accounts = this.get('bank_accounts');

		return _.filter(bank_accounts.get('content'), function(bank_account) {
			if (bank_account.get('can_debit')) {
				return bank_account;
			}
		});
	}.property('bank_accounts.@each.can_debit'),

	debitable_funding_instruments: function() {
		return this.get('debitable_bank_accounts').concat(this.get('cards.content'));
	}.property('debitable_bank_accounts', 'cards.@each'),

	type: function() {
		return (this.get('ein') && this.get('business_name')) ? 'Business' : 'Person';
	}.property('ein', 'business_name'),

	is_business: function() {
		return this.get('type') === 'Business';
	}.property('type'),

	is_person: function() {
		return this.get('type') === 'Person';
	}.property('type'),

	display_me: function() {
		return this.get('name') || this.get('id');
	}.property('name', 'id'),

	display_me_with_email: function() {
		var name = this.get('name') || this.get('id');
		var email = this.get('email');
		if (email) {
			return "%@ (%@)".fmt(name, email);
		} else {
			return name;
		}
	}.property('name', 'id', 'email'),

	facebook_url: function() {
		if (this.get('facebook')) {
			return 'http://facebook.com/profile.php?id=' + this.get('facebook');
		} else {
			return undefined;
		}
	}.property('facebook'),

	twitter_url: function() {
		if (this.get('twitter')) {
			return 'http://twitter.com/#/' + this.get('twitter');
		} else {
			return undefined;
		}
	}.property('twitter'),

	displayName: function() {
		var name;
		if (this.get('is_business')) {
			name = this.get('business_name');
		} else {
			name = this.get('name');
		}
		var email = this.get('email');
		if (name) {
			if (email) {
				name += ' (%@)'.fmt(email);
			}
		} else {
			name = email;
		}
		return name;
	}.property('is_business', 'business_name', 'name', 'email'),

	country_name: function() {
		return Balanced.CountryCodesToNames[this.get('address.country_code')];
	}.property('address.country_code'),

	address_string: function() {
		var seperator = ', ';
		var addressParts = [];
		var city = this.get('address.city');
		var cityLine = '';

		addressParts.push(this.get('address.line1'));
		addressParts.push(this.get('address.line2'));

		cityLine = (city ? city + ', ' : '') + ' ' + (this.get('address.postal_code') || '');
		addressParts.push($.trim(cityLine));
		addressParts.push(this.get('address.country_code'));

		addressParts = _.compact(addressParts);
		return addressParts.join(seperator);
	}.property('address.line1', 'address.line2', 'address.city', 'address.state', 'address.postal_code', 'address.country_code'),

	dob: function() {
		var month = this.get('dob_month');
		var year = this.get('dob_year');

		if (month && year) {
			return "%@-%@".fmt(year, month);
		} else {
			return year;
		}
	}.property('dob_month', 'dob_year'),

	dob_error: function() {
		return this.get('validationErrors.dob_month') || this.get('validationErrors.dob_year');
	}.property('validationErrors.dob_month', 'validationErrors.dob_year')
});

Balanced.TypeMappings.addTypeMapping('customer', 'Balanced.Customer');
