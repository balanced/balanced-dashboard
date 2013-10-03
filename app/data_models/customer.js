var attr = DS.attr;
var hasMany = DS.hasMany;
var belongsTo = DS.belongsTo;

Balanced.CustomerModel = DS.Model.extend({

	name: attr('string'),
	email: attr('string'),
	ein: attr('string'),
	business_name: attr('string'),
	merchant_status: attr('string'),
	created_at: attr('string'),
	updated_at: attr('string'),
	address: attr('raw'),

	bank_accounts: hasMany('bank_account_model', {async: true, inverse: 'customer'}),

	display_me: function() {
		return this.get('name') || this.get('id');
	}.property('name', 'id'),

	type: function() {
		return (this.get('ein') && this.get('business_name')) ? 'Business' : 'Person';
	}.property('ein', 'business_name'),

	country_name: function() {
		return Balanced.CountryCodesToNames[this.get('address.country_code')];
	}.property('address.country_code'),

	didLoad: function() {
		var id = this.get('id');
		this.store.findByIds('bank_account_model', [id]);
	}

});
