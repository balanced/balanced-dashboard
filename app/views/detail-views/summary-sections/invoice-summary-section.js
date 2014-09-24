import SummarySectionView from "./summary-section";
import Utils from "balanced-dashboard/lib/utils";

var InvoiceSummarySectionView = SummarySectionView.extend({
	statusText: function() {
		var createdAt = Utils.humanReadableDateLong(this.get('model.settle_at'));
		return 'on %@'.fmt(createdAt);
	}.property('model.settle_at')
});

export default InvoiceSummarySectionView;
