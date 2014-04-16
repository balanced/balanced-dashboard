Balanced.CustomersIndexController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
	needs: ['marketplace'],

	sortField: 'created_at',
	sortOrder: 'desc',

	loadsCollections: ['cards', 'bank_accounts'],

	baseClassSelector: "#customer",
	noDownloadsUri: true,

	results_base_uri: function() {
		return Balanced.Customer.create().get('uri');
	}.property()
});

Balanced.CustomersCustomerController = Balanced.ObjectController.extend(
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

		results_base_uri: Ember.computed.alias('controllers.marketplace.customers_uri')
	}
);
