Balanced.MarketplaceRoute = Balanced.AuthRoute.extend({
    model: function (params) {
        var marketplaceURI = Balanced.Marketplace.constructUri(params.marketplace_id);
        balanced.init(marketplaceURI);
        var marketplace = Balanced.Marketplace.find(marketplaceURI);
        Balanced.Utils.setCurrentMarketplace(marketplace);
        return marketplace;
    },

    // if we passed a marketplace to #linkTo, need this to set current marketplace
    setupController: function (controller, model) {
        this._super(controller, model);

        Balanced.Utils.setCurrentMarketplace(model);
    },

    events: {
        submitRefundDebit: function(refund) {
            var self = this;
            refund.save().then(function (refund) {
                self.transitionTo('refunds', refund);
            });
        },
        submitReverseCredit: function(reversal) {
            var self = this;
            reversal.save();
        },
        submitCaptureHold: function(debit) {
            var self = this;
            debit.save().then(function (debit) {
                self.transitionTo('debits', debit);
            });
        }
    }
});
