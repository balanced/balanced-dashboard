import ModelRoute from "./model";
import Debit from "../models/debit";

var DebitsRoute = ModelRoute.extend({
	title: 'Debit',
	modelObject: Debit,
	marketplaceUri: 'debits_uri',
	setupController: function(controller, model) {
		this._super(controller, model);
		controller.setProperties({
			disputesResultsLoader: model.getDisputesLoader()
		});
	}
});

export default DebitsRoute;
