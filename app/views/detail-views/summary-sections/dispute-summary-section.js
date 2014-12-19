import SummarySectionView from "./summary-section";

var DisputeSummarySectionView = SummarySectionView.extend({
	statusText: function() {
		var status = this.get('model.status');

		if (status === 'needs_attention') {
			return 'Provide documentation to fight this dispute';
		} else if (status === 'under_review') {
			return 'This dispute is under review. Once the card holder issues a decision, the status will update to won or lost.';
		}
		return null;
	}.property('model.status'),

	linkedResources: function() {
		return this.resourceLinks("model.transaction.customer", "model.transaction.source");
	}.property("model.transaction.customer", "model.transaction.source")
});

export default DisputeSummarySectionView;
