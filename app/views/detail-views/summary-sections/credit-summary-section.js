import SummarySectionView from "./summary-section";

var CreditSummarySectionView = SummarySectionView.extend({
	statusText: Ember.computed.alias('model.status_description'),

	linkedResources: function() {
		return this.resourceLinks("model.order", "model.reversals", "model.customer", "model.destination");
	}.property("model.order", "model.reversals", "model.reversals.length", "model.customer", "model.destination")
});
