Balanced.MarketplaceRoute = Balanced.AuthRoute.extend({
	model: function(params) {
		var marketplaceURI = Balanced.Marketplace.constructUri(params.marketplace_id);
		var marketplace = Balanced.Marketplace.find(marketplaceURI);
		return marketplace;
	},

	afterModel: function(model) {
		// balanced.js doesn't load in phantomjs environment, so skip it here
		// TODO - get balanced.js working in test
		if (!window.TESTING) {
			balanced.init({
				server: 'https://js-pmtest.balancedpayments.com',
				revision: 1.1
			});
		}
		Balanced.Utils.setCurrentMarketplace(model);
	},

	// if we passed a marketplace to #linkTo, need this to set current marketplace
	setupController: function(controller, model) {
		this._super(controller, model);

		Balanced.Utils.setCurrentMarketplace(model);
	},

	actions: {
		submitRefundDebit: function(refund) {
			var self = this;
			refund.save().then(function(refund) {
				self.transitionTo('refunds', refund);
			});
		},
		submitReverseCredit: function(reversal) {
			var self = this;
			reversal.save().then(function(reversal) {
				self.transitionTo('reversals', reversal);
			});
		},
		submitCaptureHold: function(debit) {
			var self = this;
			debit.save().then(function(debit) {
				self.transitionTo('debits', debit);
			});
		}
	}
});
