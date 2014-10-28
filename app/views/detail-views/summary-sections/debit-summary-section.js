import SummarySectionView from "./summary-section";

var DebitSummarySectionView = SummarySectionView.extend({
	statusText: Ember.computed.alias('model.status_description'),

	editModelModalClass: function() {
		return this.get("container").lookupFactory("view:modals/edit-description-modal");
	}.property("model"),

	linkedResources: function() {
		return this.resourceLinks("model.description", "model.customer", "model.source");
	}.property("model.description", "model.customer", "model.source")
});

export default DebitSummarySectionView;
