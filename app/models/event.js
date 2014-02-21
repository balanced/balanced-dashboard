Balanced.Event = Balanced.Model.extend({
	transactions: Balanced.Model.hasMany('entity', 'Balanced.Transaction'),
	eventCallbacks: Balanced.Model.hasMany('callbacks', 'Balanced.EventCallback'),

	transaction: function() {
		var transactions = this.get('transactions.content');
		if (!transactions || !transactions.length) {
			return false;
		}

		return transactions[0];
	}.property('transactions'),


	uri: '/events'
});

Balanced.TypeMappings.addTypeMapping('event', 'Balanced.Event');
