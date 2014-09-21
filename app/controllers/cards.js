import Ember from "ember";

var EventMixin = Balanced.ActionEvented('openDebitFundingInstrumentModal', 'openCreditFundingInstrumentModal', 'openHoldCardModal');

var CardsController = Ember.ObjectController.extend(EventMixin, {
	needs: ['marketplace'],

	actions: {
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
			this.get("transactionsResultsLoader").setStatusFilter(status);
		},
	}
});

export default CardsController;
