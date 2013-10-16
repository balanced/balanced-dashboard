Balanced.OrderCustomerComponent = Ember.Component.extend({

	is_visible: true,
	classNames: ['order-customer'],

	show_transactions: function() {
		return this.get('is_visible') && this.get('has_transactions');
	}.property('is_visible', 'has_transactions'),

	has_transactions: function() {
		return this.get('credits_list.length') || this.get('debits_list.length');
	}.property('credits_list.@each', 'debits_list.@each'),

	toggle_display: function() {
		return this.get('is_visible') ? 'Hide details' : 'Show details';
	}.property('is_visible'),

	title: function() {
		var name = this.get('customer.name');
		return name ? name : this.get('customer.id');
	}.property('customer.name'),

	amounts: function() {
		var amounts = {
			credited: 0,
			debited: 0,
			pending: 0
		};
		var credits = this.get('credits_list') || Ember.A();
		var debits = this.get('debits_list') || Ember.A();

		debits.forEach(function(debit) {
			var amount = debit.get('amount');
			if(debit.get('status') === 'succeeded') {
				amounts.debited += amount;
			} else {
				amounts.pending += amount;
			}
		});

		credits.forEach(function(credit) {
			var amount = credit.get('amount');
			if(credit.get('status') === 'succeeded') {
				amounts.credited += amount;
			} else {
				amounts.pending += amount;
			}
		});

		_.each(amounts, function(amount, key) {
			amounts[key] = Balanced.Utils.formatCurrency(amount);
		});

		return Ember.Object.create(amounts);
	}.property('credits_list.@each', 'debits_list.@each'),

	// filter credits by those that belong to the customer
	credits_list: function() {
		var customer = this.get('customer');
		var credits = this.get('credits') || Ember.A();
		var list = Ember.A();

		credits.forEach(function(credit) {
			if(customer && credit.get('customer_uri') === customer.get('href')) {
				list.pushObject(credit);
			}
		});

		return list;
	}.property('credits.@each', 'customer'),

	// filter debits by those that belong to the customer
	debits_list: function() {
		var customer = this.get('customer');
		var debits = this.get('debits') || Ember.A();
		var list = Ember.A();

		debits.forEach(function(debit) {
			if(customer && debit.get('customer_uri') === customer.get('href')) {
				list.pushObject(debit);
			}
		});

		return list;
	}.property('debits.@each', 'customer'),

	actions: {
		toggle_visibility: function() {
			var visibility = this.get('is_visible');
			this.set('is_visible', !visibility);
		}
	}

});
