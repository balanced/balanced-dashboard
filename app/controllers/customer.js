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

		changeDateFilter: function(startTime, endTime) {
			this.get("transactionsResultsLoader").setProperties({
				endTime: endTime,
				startTime: startTime
			});
		},

		changeTypeFilter: function(type) {
			if (type === "transaction") {
				type = null;
			}
			this.set("transactionsResultsLoader.type", type);
		},

		changeTransactionsSort: function(column) {
			this.get("transactionsResultsLoader").setSortField(column);
		},

		changeStatusFilter: function(status) {
			if (status === "all") {
				status = null;
			}
			this.set("transactionsResultsLoader.status", status);
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
			$('.' + className).slideToggle(200);
		}
	}
});
