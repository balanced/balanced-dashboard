import Ember from "ember";
import Utils from "balanced-dashboard/lib/utils";

var resultsLoaderProperty = function(methodName) {
	return function() {
		return this.get("model")[methodName]();
	}.property("model");
};

var OrdersController = Ember.ObjectController.extend({
	needs: ['marketplace'],

	debitsResultsLoader: resultsLoaderProperty("getOrderDebitsResultsLoader"),
	creditsResultsLoader: resultsLoaderProperty("getOrderCreditsResultsLoader")
});

export default OrdersController;
