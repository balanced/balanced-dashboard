Balanced.MarketplaceCustomersController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
	needs: ['marketplace'],

	sortField: 'created_at',
	sortOrder: 'desc',
	baseClassSelector: "#customer",
	noDownloadsUri: true,

	results_base_uri: Ember.computed.readOnly('controllers.marketplace.customers_uri')
});

Balanced.CustomerController = Balanced.ObjectController.extend(
	Balanced.ActionEvented('openDeleteBankAccountModal', 'openDeleteCardModal'),
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

		results_base_uri: function() {
			if (this.get('isDisputeType')) {
				return this.get('content.disputes_uri');
			}

			return this.get('content.transactions_uri');
		}.property('content.transactions_uri', 'content.disputes_uri')
	}
);
