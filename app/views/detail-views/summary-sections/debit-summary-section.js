import SummarySectionView from "./summary-section";

var DebitSummarySectionView = SummarySectionView.extend({
	statusText: Ember.computed.alias('model.status_description'),

	linkedResources: function() {
		return this.resourceLinks("model.description", "model.customer", "model.source");
	}.property("model.description", "model.customer", "model.source")
});

export default DebitSummarySectionView;
