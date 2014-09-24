import Ember from "ember";
import ListSectionView from "./list-section";
import Utils from "balanced-dashboard/lib/utils";

var OrderBuyersSectionView = ListSectionView.extend({
	title: function() {
		var titleText = ' %@ ';
		var totalBuyers = this.get('totalBuyers');

		if (totalBuyers) {
			titleText += '(%@)'.fmt(totalBuyers);
		}

		return Utils.safeFormat(titleText, "Buyers").htmlSafe();
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
