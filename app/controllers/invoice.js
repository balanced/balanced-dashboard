Balanced.InvoiceController = Balanced.ObjectController.extend(
	Ember.Evented,
	Balanced.ResultsTable, {
		needs: ['marketplace'],
		marketplace: Ember.computed.alias('controllers.marketplace.content'),

		type: 'hold',
		sortField: 'created_at',
		sortOrder: 'desc',
		limit: 20,
		transactionStatus: 'all',

		baseClassSelector: '#invoice',

		init: function() {
			var self = this;

			Balanced.Model.Events.on('didCreate', function(object) {
				if (Balanced.Transaction.prototype.isPrototypeOf(object)) {
					self.send('reload');
				}
			});
		},

		extra_filtering_params: function() {
			var transactionStatus = this.get("transactionStatus");
			if (transactionStatus === 'all') {
				return {
					'status[in]': 'failed,succeeded,pending'
				};
			}
			return {
				status: transactionStatus
			};
		}.property("transactionStatus"),

		actions: {
			printSummary: function() {
				window.print();
			},
			changeStatusFilter: function(status) {
				this.set('transactionStatus', status);
			},
			changeDisputeStatusFilter: function(status) {
				this.set('disputesResultsLoader.statusFilters', status);
			}
		},

		results: function() {
			var type = this.get("type");
			var typeMappings = {
				debit: "debits",
				credit: "credits",
				failed_credit: "failed_credits",
				reversal: "reversals",
				hold: "holds",
				refund: "refunds",
				card_debit: "card_debits",
				bank_account_debit: "bank_account_debits"
			};
			if (typeMappings[type]) {
				return this.get(typeMappings[type]);
			}

			return null;
		}.property('type', 'debits', 'credits', 'holds', 'failed_credits', 'refunds', 'card_debits', 'bank_account_debits'),

		dispute_results: Ember.computed.alias('disputes'),

		results_base_uri: Ember.computed.alias('controllers.marketplace.invoices_uri')
	}
);
