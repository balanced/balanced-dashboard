import Ember from "ember";
import ListSectionView from "./list-section";

var OrderBuyersSectionView = ListSectionView.extend({
	title: function() {
		var titleText = ' %@ ';
		var totalBuyers = this.get('totalBuyers');

		if (totalBuyers) {
			titleText += '(%@)'.fmt(totalBuyers);
		}

		return Balanced.Utils.safeFormat(titleText, "Buyers").htmlSafe();
	}.property('totalBuyers'),

	resources: Ember.computed.alias("buyersResults"),

	totalBuyers: function() {
		return this.get("buyersResults.total");
	}.property("buyersResults.total"),

	buyersResults: function() {
		return this.get("model").getBuyersResultsLoader({
			limit: 20
		}).get("results");
	}.property("model"),


	linkedResources: function() {
		return this.resourceLinks("buyersResults");
	}.property("buyersResults", "buyersResults.length")
});

export default OrderBuyersSectionView;
