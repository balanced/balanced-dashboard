import SummarySectionView from "./summary-section";

var CreditSummarySectionView = SummarySectionView.extend({
	statusText: Ember.computed.alias('model.status_description'),

	linkedResources: function() {
		return this.resourceLinks("model.description", "model.customer", "model.destination");
	}.property("model.customer", "model.destination", "model.description")
});

export default CreditSummarySectionView;
