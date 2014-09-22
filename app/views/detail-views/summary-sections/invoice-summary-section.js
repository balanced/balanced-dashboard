import SummarySectionView from "./summary-section";

var InvoiceSummarySectionView = SummarySectionView.extend({
	statusText: function() {
		var createdAt = Balanced.Utils.humanReadableDateLong(this.get('model.settle_at'));
		return 'on %@'.fmt(createdAt);
	}.property('model.settle_at')
});
