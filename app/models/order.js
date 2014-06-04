Balanced.Order = Balanced.Model.extend({
	uri: '/orders',
	route_name: 'orders',

	buyers: Balanced.Model.hasMany('buyers', 'Balanced.Customer'),
	credits: Balanced.Model.hasMany('credits', 'Balanced.Credit'),
	debits: Balanced.Model.hasMany('debits', 'Balanced.Debit'),
	reversals: Balanced.Model.hasMany('reversals', 'Balanced.Reversal'),
	refunds: Balanced.Model.hasMany('refunds', 'Balanced.Refund'),
	seller: Balanced.Model.belongsTo('merchant', 'Balanced.Customer'),

	page_title: Balanced.computed.orProperties('description', 'id'),

	amount_credited: function() {
		return this.get('amount') - this.get('amount_escrowed');
	}.property('amount', 'amount_escrowed'),

	debits_amount: Balanced.computed.transform('amount', Balanced.Utils.formatCurrency),
	escrow_balance: Balanced.computed.transform('amount_escrowed', Balanced.Utils.formatCurrency),
	credits_amount: Balanced.computed.transform('amount_credited', Balanced.Utils.formatCurrency)
});

Balanced.TypeMappings.addTypeMapping('order', 'Balanced.Order');
