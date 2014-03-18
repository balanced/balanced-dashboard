Balanced.OrderCustomerComponent = Ember.Component.extend({
	submitRefundDebitEvent: 'submitRefundDebit',
	submitReverseCreditEvent: 'submitReverseCredit',
	submitCaptureHoldEvent: 'submitCaptureHold',
	submitCreditCustomerEvent: 'submitCreditCustomer',
	submitDebitCustomerEvent: 'submitDebitCustomer',

	is_visible: true,
	classNames: ['order-customer'],

	show_transactions: function() {
		return this.get('is_visible') && this.get('has_transactions');
	}.property('is_visible', 'has_transactions'),

	has_transactions: function() {
		return this.get('credits_list.length') || this.get('debits_list.length');
	}.property('credits_list', 'debits_list',
			'credits_list.length', 'debits_list.length'),

	toggle_display: function() {
		return this.get('is_visible') ? 'Hide details' : 'Show details';
	}.property('is_visible'),

	title: function() {
		return this.get('customer.name') || this.get('customer.id');
	}.property('customer.name', 'customer.id', 'customer'),

	amounts: function() {
		var amounts = {};
		var lists = ['credits_list', 'debits_list', 'refunds_list', 'reversals_list'];

		_.each(lists, function(type) {
			amounts[type] = {
				quantity: 0,
				total: 0
			};

			var list = this.get(type) || Ember.A();
			list.forEach(function (thing) {
				amounts[type].quantity++;

				if (thing.get('is_succeeded')) {
					amounts[type].total += thing.get('amount');
				}
			});
		}, this);

		return amounts;
	}.property('credits_list', 'debits_list', 'refunds_list', 'reversals_list',
			'credits_list.@each.amount', 'debits_list.@each.amount',
			'refunds_list.@each.amount', 'reversals_list.@each.amount',
			'credits_list.@each.is_succeeded', 'debits_list.@each.is_succeeded',
			'refunds_list.@each.is_succeeded', 'reversals_list.@each.is_succeeded'),

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
			debit.get('refunds').then(function(r) {
				refunds.pushObjects(r.content);
			});
		});

		return refunds;
	}.property('debits_list', 'debits_list.@each.refunds'),

	reversals_list: function() {
		var credits = this.get('credits_list');
		var reversals = Ember.A();

		credits.forEach(function(credit) {
			credit.get('reversals').then(function(r) {
				reversals.pushObjects(r.content);
			});
		});

		return reversals;
	}.property('credits_list', 'credits_list.@each.reversals'),

	actions: {
		toggle_visibility: function() {
			var visibility = this.get('is_visible');
			this.set('is_visible', !visibility);
		},
		submitRefundDebit: function(refund) {
			this.sendAction('submitRefundDebitEvent', refund);
		},
		submitReverseCredit: function(reversal) {
			this.sendAction('submitReverseCreditEvent', reversal);
		},
		submitCaptureHold: function(debit) {
			this.sendAction('submitCaptureHoldEvent', debit);
		},
		submitCreditCustomer: function(credit) {
			this.sendAction('submitCreditCustomerEvent', credit);
		},
		submitDebitCustomer: function(debit) {
			this.sendAction('submitDebitCustomerEvent', debit);
		}
	}

});
