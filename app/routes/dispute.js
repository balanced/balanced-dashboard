import ModelRoute from "./model";
import Dispute from "../models/dispute";

var DisputeRoute = ModelRoute.extend({
	title: 'Dispute',
	modelObject: Dispute,
	marketplaceUri: 'disputes_uri',
	setupController: function(controller, dispute) {
		this._super(controller, dispute);

		controller.setProperties({
			transactionsResultsLoader: dispute.getTransactionsLoader()
		});
	}
});

export default DisputeRoute;
