var attr = DS.attr;
var hasMany = DS.hasMany;
var belongsTo = DS.belongsTo;

Balanced.MarketplaceModel = DS.Model.extend({

	// attributes

	name: attr('string'),
	href: attr('string'),
	domain_url: attr('string'),
	created_at: attr('string'),
	updated_at: attr('string'),
	support_email_address: attr('string'),
	support_phone_number: attr('string'),

	// relations

	owner_customer: belongsTo('customer_model', {async: true}),

	// computed properties

	uri: function() {
		return this.get('href');
	}.property('href'),

	production: function() {
		return this.get('uri').indexOf('TEST') === -1;
	}.property('uri')

});
