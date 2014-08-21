Balanced.MarketplaceRoute = Balanced.AuthRoute.extend({
	model: function(params) {
		return this.get("auth.user").get("marketplacesLoader").find(params.marketplace_id);
	},

	afterModel: function(model) {
		Balanced.Utils.setCurrentMarketplace(model);
	},

	// if we passed a marketplace to #link-to, need this to set current marketplace
	setupController: function(controller, model) {
		this._super(controller, model);

		Balanced.Utils.setCurrentMarketplace(model);
		controller.updateGuestNotification();
		controller.updateProductionMarketplaceNotification();
		controller.updateBankAccountNotifications();
	},

	actions: {
		submitRefundDebit: function(refund) {
			this.transitionTo('refunds', refund);
		},
		submitReverseCredit: function(reversal) {
			this.transitionTo('reversals', reversal);
		},
		submitCaptureHold: function(debit) {
			this.transitionTo('debits', debit);
		},
		submitCreditCustomer: function(credit) {
			this.transitionTo('credits', credit);
		},
		submitDebitCustomer: function(debit) {
			this.transitionTo('debits', debit);
		}
	}
});
