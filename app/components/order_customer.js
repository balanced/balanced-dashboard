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
			refunded: 0,
			reversed: 0,
			pending: 0
		};
		var credits = this.get('credits_list');
		var debits = this.get('debits_list');
		var refunds = this.get('refunds_list');
		var reversals = this.get('reversals_list');

		debits.forEach(function(debit) {
			var amount = debit.get('amount');
			if (debit.get('status') === 'succeeded') {
				amounts.debited += amount;
			} else {
				amounts.pending += amount;
			}
		});

		credits.forEach(function(credit) {
			var amount = credit.get('amount');
			if (credit.get('status') === 'succeeded') {
				amounts.credited += amount;
			} else {
				amounts.pending += amount;
			}
		});

		refunds.forEach(function(refund) {
			var amount = refund.get('amount');
			if (refund.get('status') === 'succeeded') {
				amounts.refunded += amount;
			} else {
				amounts.pending += amount;
			}
		});

		reversals.forEach(function(reversal) {
			var amount = reversal.get('amount');
			if (reversal.get('status') === 'succeeded') {
				amounts.reversed += amount;
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
				console.log(r, r.get('length'));
				r.forEach(function(refund) {
					refunds.push(refund);
				});
			});
		});

		return refunds;
	}.property('debits_list', 'debits_list.@each.refunds'),

	reversals_list: function() {
		var credits = this.get('credits_list');
		var reversals = Ember.A();

		credits.forEach(function(credit) {
			credit.get('reversals').then(function(r) {
				console.log(r, r.get('length'));
				r.forEach(function(reversal) {
					reversals.push(reversal);
				});
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
