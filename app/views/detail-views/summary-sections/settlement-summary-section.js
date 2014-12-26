import SummarySectionView from "./summary-section";
import Utils from "balanced-dashboard/lib/utils";

var SettlementSummarySectionView = SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.description", "model.source", "model.destination", "model.customer");
	}.property('model.description', 'model.source', 'model.destination', 'model.customer'),
});

export default SettlementSummarySectionView;
