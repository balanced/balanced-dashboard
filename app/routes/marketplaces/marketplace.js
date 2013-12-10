Balanced.MarketplaceRoute = Balanced.AuthRoute.extend({
	model: function(params) {
		var marketplaceURI = Balanced.Marketplace.constructUri(params.marketplace_id);
		var marketplace = Balanced.Marketplace.find(marketplaceURI);
		return marketplace;
	},

	afterModel: function(model) {
		Balanced.Utils.setCurrentMarketplace(model);
	},

	// if we passed a marketplace to #linkTo, need this to set current marketplace
	setupController: function(controller, model) {
		this._super(controller, model);

		Balanced.Utils.setCurrentMarketplace(model);
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
