import AuthRoute from "balanced-dashboard/routes/auth";

var MarketplaceIndexRoute = AuthRoute.extend({
	beforeModel: function() {
		var mp = this.modelFor("marketplace");
		if (mp.get("isOrdersRequired")) {
			this.transitionTo('marketplace.orders');
		}
		else {
			this.transitionTo('marketplace.transactions');
		}
	}
});

export default MarketplaceIndexRoute;
