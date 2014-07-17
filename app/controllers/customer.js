Balanced.CustomerController = Balanced.ObjectController.extend(
	Balanced.ActionEvented('openDeleteBankAccountModal', 'openDeleteCardModal'),
	Balanced.ResultsTable, {
		needs: ['marketplace'],

		sortField: 'created_at',
		sortOrder: 'desc',

		loadsCollections: ['cards', 'bank_accounts'],

		baseClassSelector: "#customer",

		transactionStatus: 'all',
		disputeStatus: 'all',

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

		results_base_uri: Ember.computed.alias('content.transactions_uri'),

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
			openDeleteModal: function(funding_instrument) {
				if (funding_instrument.get('type_name').indexOf('card') >= 0) {
					this.trigger('openDeleteCardModal', funding_instrument);
				} else if (funding_instrument.get('type_name').indexOf('account') >= 0) {
					this.trigger('openDeleteBankAccountModal', funding_instrument);
				}
			},

			changeStatusFilter: function(status) {
				this.set('transactionStatus', status);
			},

			changeDisputeStatusFilter: function(status) {
				this.set('disputesResultsLoader.statusFilters', status);
			},

			toggleDrawer: function(className) {
				$('.' + className).slideToggle();
			}
		}
	}
);
