import BaseResultsLoader from "./base";
import SearchModelArray from "../core/search-model-array";
import Hold from "balanced-dashboard/models/hold";
import Debit from "balanced-dashboard/models/debit";
import Refund from "balanced-dashboard/models/refund";
import Dispute from "balanced-dashboard/models/dispute";
import Customer from "balanced-dashboard/models/customer";

var OrderDebitsResultsLoader = BaseResultsLoader.extend({
	debits: function() {
		var debitUri = this.get("order.debits_uri");
		return SearchModelArray.newArrayLoadedFromUri(debitUri, Customer);
	}.property("order.debits_uri"),

	results: function () {
		var results = SearchModelArray.create({
   			isLoaded: true,
   			content: []
   		});

		console.log(results, this.get("debits"))
		this.get("debits").then(function(debits) {
			debits.get("content").forEach(function(debit) {
				var hasCustomer = results.findBy('customer_uri', debit.get('customer_uri'));
				if(!hasCustomer) {
					results.get("content").pushObject(Ember.Object.create({
						customer_uri: debit.get('customer_uri'),
						debits: []
					}));
				}
				results.findBy('customer_uri', debit.get('customer_uri')).get('debits').pushObject(debit);
			});
			console.log("results:", results);

			return results;
		});
	}.property('debits.content.[]')
});

export default OrderDebitsResultsLoader;
