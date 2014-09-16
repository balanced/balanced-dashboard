var generateResultsLoader = function(klass, uriFieldName) {
	return function(attributes) {
		attributes = _.extend({
			path: this.get(uriFieldName)
		}, attributes);
		return klass.create(attributes);
	};
};

Balanced.Order = Balanced.Model.extend({
	uri: '/orders',
	route_name: 'orders',
	type_name: 'Order',

	buyers: Balanced.Model.hasMany('buyers', 'Balanced.Customer'),
	seller: Balanced.Model.belongsTo('merchant', 'Balanced.Customer'),

	credits: Balanced.Model.hasMany('credits', 'Balanced.Credit'),
	debits: Balanced.Model.hasMany('debits', 'Balanced.Debit'),
	reversals: Balanced.Model.hasMany('reversals', 'Balanced.Reversal'),
	refunds: Balanced.Model.hasMany('refunds', 'Balanced.Refund'),

	page_title: Balanced.computed.orProperties('description', 'id'),

	amount_credited: function() {
		return this.get('amount') - this.get('amount_escrowed');
	}.property('amount', 'amount_escrowed'),

	debits_amount: Balanced.computed.transform('amount', Balanced.Utils.formatCurrency),
	escrow_balance: Balanced.computed.transform('amount_escrowed', Balanced.Utils.formatCurrency),
	credits_amount: Balanced.computed.transform('amount_credited', Balanced.Utils.formatCurrency),

	getBuyersResultsLoader: generateResultsLoader(Balanced.CustomersResultsLoader, "buyers_uri"),
	getCreditsResultsLoader: generateResultsLoader(Balanced.TransactionsResultsLoader, "credits_uri"),
	getDebitsResultsLoader: generateResultsLoader(Balanced.TransactionsResultsLoader, "debits_uri"),
	getRefundsResultsLoader: generateResultsLoader(Balanced.TransactionsResultsLoader, "refunds_uri"),
	getReversalsResultsLoader: generateResultsLoader(Balanced.TransactionsResultsLoader, "reversals_uri"),

	// filter credits by those that belong to the customer
	credits_list: function() {
		var customer = this.get('customer.href');
		var credits = this.get('credits') || Ember.A();

		if (!customer) {
			return credits;
		}

		credits = credits.filter(function(credit) {
			return credit.get('customer_uri') === customer;
		});

		return credits;
	}.property('credits', 'credits.@each.customer_uri', 'customer'),

	// filter debits by those that belong to the customer
	debits_list: function() {
		var customer = this.get('customer.href');
		var debits = this.get('debits') || Ember.A();

		if (!customer) {
			return debits;
		}

		debits = debits.filter(function(debit) {
			return debit.get('customer_uri') === customer;
		});

		return debits;
	}.property('debits', 'debits.@each.customer_uri', 'customer'),

	refunds_list: function() {
		var debits = this.get('debits_list');
		var refunds = Ember.A();

		debits.forEach(function(debit) {
			debit.get('refunds').then(function(refund) {
				refunds.pushObjects(refund.content);
			});
		});
		return refunds;
	}.property('debits_list', 'debits_list.@each.refunds'),

	reversals_list: function() {
		var credits = this.get('credits_list');
		var reversals = Ember.A();

		credits.forEach(function(credit) {
			credit.get('reversals').then(function(reversal) {
				reversals.pushObjects(reversal.content);
			});
		});

		return reversals;
	}.property('credits_list', 'credits_list.@each.reversals')
});

Balanced.TypeMappings.addTypeMapping('order', 'Balanced.Order');
