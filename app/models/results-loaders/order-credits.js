import BaseResultsLoader from "./base";
import SearchModelArray from "../core/search-model-array";
import Credit from "balanced-dashboard/models/credit";

var OrderCreditsResultsLoader = BaseResultsLoader.extend({
	results: function() {
		var seller = this.get("order.seller");
		var creditUri = this.get("order.credits_uri");
		var creditsArray = SearchModelArray.newArrayLoadedFromUri(creditUri, Credit);

		var results = SearchModelArray.create({
			isLoaded: true,
			content: []
		});

		creditsArray.then(function(credits){
			credits.forEach(function(credit) {
				var customer = null;

				if (seller && credit.get('customer_uri') === seller.get('uri')) {
					customer = seller;
				}

				var hasCustomer = results.findBy('customer_uri', credit.get('customer_uri'));

				if(!hasCustomer) {
					results.get("content").pushObject(Ember.Object.create({
						customer_uri: credit.get('customer_uri'),
						customer: customer,
						transactions: []
					}));
				}
				results.findBy('customer_uri', credit.get('customer_uri')).get('transactions').pushObject(credit);
			});
		});

		return results;
	}.property("order.credits_uri", "order.seller"),
});

export default OrderCreditsResultsLoader;
