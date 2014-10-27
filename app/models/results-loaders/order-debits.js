import BaseResultsLoader from "./base";
import SearchModelArray from "../core/search-model-array";
import Hold from "balanced-dashboard/models/hold";
import Debit from "balanced-dashboard/models/debit";
import Refund from "balanced-dashboard/models/refund";
import Dispute from "balanced-dashboard/models/dispute";
import Customer from "balanced-dashboard/models/customer";

var OrderDebitsResultsLoader = BaseResultsLoader.extend({
	results: function() {
		var results = SearchModelArray.create({
			isLoaded: true,
			content: []
		});

		var buyers = this.get("order.buyers");
		var debitUri = this.get("order.debits_uri");
		var debitsArray = SearchModelArray.newArrayLoadedFromUri(debitUri, Customer);

		debitsArray.then(function(debits){
			debits.forEach(function(debit) {
				var hasCustomer = results.findBy('customer_uri', debit.get('customer_uri'));
				var buyer = buyers.findBy("uri", debit.get('customer_uri'));

				if(!hasCustomer) {
					results.get("content").pushObject(Ember.Object.create({
						customer_uri: debit.get('customer_uri'),
						customer: buyer,
						debits: []
					}));
				}
				results.findBy('customer_uri', debit.get('customer_uri')).get('debits').pushObject(debit);
			});
		});

		return results;
	}.property("order.debits_uri", "order.buyers"),
});

export default OrderDebitsResultsLoader;
