Balanced.Order = Balanced.Model.extend({
	uri: '/orders',

	buyers: Balanced.Model.hasMany('buyers', 'Balanced.Customer'),
	credits: Balanced.Model.hasMany('credits', 'Balanced.Credit'),
	debits: Balanced.Model.hasMany('debits', 'Balanced.Debit'),
	reversals: Balanced.Model.hasMany('reversals', 'Balanced.Reversal'),
	refunds: Balanced.Model.hasMany('refunds', 'Balanced.Refund'),
	seller: Balanced.Model.belongsTo('merchant', 'Balanced.Customer'),

	page_title: function() {
		return this.get('description') || this.get('id');
	}.property('description', 'id'),

	debits_amount: function() {
		return Balanced.Utils.formatCurrency(this.get('amount'));
	}.property('amount'),

	credits_amount: function() {
		return Balanced.Utils.formatCurrency(
			this.get('amount') - this.get('amount_escrowed')
		);
	}.property('amount', 'amount_escrowed'),

	escrow_balance: function() {
		var cents = this.get('amount_escrowed');
		return Balanced.Utils.formatCurrency(cents);
	}.property('amount_escrowed')
});

Balanced.TypeMappings.addTypeMapping('order', 'Balanced.Order');
