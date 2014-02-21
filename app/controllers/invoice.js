Balanced.InvoicesInvoiceController = Balanced.ObjectController.extend(
	Ember.Evented,
	Balanced.ResultsTable,
	Balanced.TransactionsTable, {
		needs: ['marketplace'],
		marketplace: Ember.computed.alias('controllers.marketplace.content'),

		type: 'hold',
		sortField: 'created_at',
		sortOrder: 'desc',
		limit: 20,

		baseClassSelector: '#invoice',

		init: function() {
			var self = this;

			Balanced.Model.Events.on('didCreate', function(object) {
				if (Balanced.Transaction.prototype.isPrototypeOf(object)) {
					self.send('reload');
				}
			});
		},

		actions: {
			printSummary: function() {
				window.print();
			}
		},

		results: function() {
			var result = null;
			var type = this.get("type");
			var typeMappings = {
				debit: "debits",
				credit: "credits",
				failed_credit: "failed_credits",
				hold: "holds",
				refund: "refunds",
				card_debit: "card_debits",
				bank_account_debit: "bank_account_debits",
				dispute: "disputes"
			};

			if (typeMappings[type] !== undefined) {
				result = this.get(typeMappings[type]);
			}
			return result;
		}.property(
			'type', 'debits', 'credits', 'holds', 'failed_credits', 'refunds',
			'card_debits', 'bank_account_debits', 'disputes'
		),

		results_base_uri: function() {
			return this.get('controllers.marketplace.invoices_uri');
		}.property('controllers.marketplace.invoices_uri')
	}
);
