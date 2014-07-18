var actionsMixin = Balanced.ActionEvented('openDeleteBankAccountModal', 'openDeleteCardModal');
Balanced.CustomerController = Balanced.ObjectController.extend(actionsMixin, {
	needs: ['marketplace'],

	actions: {
		openDeleteModal: function(funding_instrument) {
			if (funding_instrument.get('type_name').indexOf('card') >= 0) {
				this.trigger('openDeleteCardModal', funding_instrument);
			} else if (funding_instrument.get('type_name').indexOf('account') >= 0) {
				this.trigger('openDeleteBankAccountModal', funding_instrument);
			}
		},

		changeTypeFilter: function(type) {
			if (type === "transaction") {
				type = null;
			}
			this.set("transactionsResultsLoader.type", type);
		},

		changeTransactionsSortOrder: function(sortField, sortDirection) {
			this.get("transactionsResultsLoader").setProperties({
				sortField: sortField,
				sortDirection: sortDirection
			});
		},

		changeSortOrder: function(sortField, sortDirection) {},

		changeStatusFilter: function(status) {
			this.set('transactionStatus', status);
		},

		changeDisputeStatusFilter: function(status) {
			this.set('disputesResultsLoader.statusFilters', status);
		},
		changeDisputesSort: function(column) {
			this.get("disputesResultsLoader").setSortField(column);
		},

		changePaymentMethodFilter: function(method) {
			this.set("fundingInstrumentsResultsLoader.type", method);
		},

		toggleDrawer: function(className) {
			$('.' + className).slideToggle();
		}
	}
});
