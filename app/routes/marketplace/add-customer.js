import AuthRoute from "../auth";
import Customer from "balanced-dashboard/models/customer";

var MarketplaceAddCustomerRoute = AuthRoute.extend({
	pageTitle: 'Add customer',

	setupController: function(controller, model) {
		var marketplace = this.modelFor('marketplace');

		controller.set('content', Customer.create({
			uri: marketplace.get('customers_uri'),
			address: {}
		}));

		controller.set('optionalFieldsOpen', false);
	}
});

export default MarketplaceAddCustomerRoute;
