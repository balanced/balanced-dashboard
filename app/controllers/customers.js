Balanced.CustomersController = Balanced.ObjectController.extend(
	Ember.Evented,
	Balanced.ResultsTable,
	Balanced.TransactionsTable, {
		needs: ['marketplace'],

		sortField: 'created_at',
		sortOrder: 'desc',

		loadsCollections: ['cards', 'bank_accounts'],

		baseClassSelector: "#customer",

		init: function() {
			var self = this;
			Balanced.Model.Events.on('didCreate', function(object) {
				if (Balanced.Transaction.prototype.isPrototypeOf(object)) {
					self.send('reload');
				}
			});
		},

		loadEntireCollections: function() {
			var model = this.get('model');
			if (!model || !model.get('isLoaded')) {
				return;
			}

			_.each(this.loadsCollections, function(collectionName) {
				model.get(collectionName).loadAll();
			});
		}.observes('model', 'model.isLoaded'),

		actions: {
			promptToDeleteBankAccount: function(bankAccount) {
				this.trigger('openDeleteBankAccountModal', bankAccount);
			},

			promptToDeleteCard: function(card) {
				this.trigger('openDeleteCardModal', card);
			},
		},

		results_base_uri: function() {
			if (this.get('type') === 'dispute') {
				return this.get('content.disputes_uri');
			}

			return this.get('content.transactions_uri');
		}.property('content.transactions_uri')
	}
);
