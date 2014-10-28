import BaseResultsLoader from "./base";
import SearchModelArray from "../core/search-model-array";
import Debit from "balanced-dashboard/models/debit";

var OrderDebitsResultsLoader = BaseResultsLoader.extend({
	results: function() {
		var buyers = this.get("order.buyers");
		var debitUri = this.get("order.debits_uri");
		var debitsArray = SearchModelArray.newArrayLoadedFromUri(debitUri, Debit);

		var results = SearchModelArray.create({
			isLoaded: true,
			content: []
		});

		debitsArray.then(function(debits){
			debits.forEach(function(debit) {
				var buyer = buyers.findBy("uri", debit.get('customer_uri'));
				var hasCustomer = results.findBy('customer_uri', debit.get('customer_uri'));

				if(!hasCustomer) {
					results.get("content").pushObject(Ember.Object.create({
						customer_uri: debit.get('customer_uri'),
						customer: buyer,
						transactions: []
					}));
				}
				results.findBy('customer_uri', debit.get('customer_uri')).get('transactions').pushObject(debit);
			});
		});

		return results;
	}.property("order.debits_uri", "order.buyers"),
});

export default OrderDebitsResultsLoader;
