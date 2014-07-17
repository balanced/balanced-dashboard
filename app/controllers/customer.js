var actionsMixin = Balanced.ActionEvented('openDeleteBankAccountModal', 'openDeleteCardModal');
Balanced.CustomerController = Balanced.ObjectController.extend(actionsMixin, {
	needs: ['marketplace'],
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

		changeTypeFilter: function(type) {
			if (type === "transaction") {
				type = null;
			}
			this.set("transactionsResultsLoader.type", type);
		},
		changeSortOrder: function(sortField, sortDirection) {
			this.get("transactionsResultsLoader").setProperties({
				sortField: sortField,
				sortDirection: sortDirection
			});
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
});
