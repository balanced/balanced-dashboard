import SummarySectionView from "./summary-section";

var LogSummarySectionView = SummarySectionView.extend({
	statusText: Ember.computed.alias('model.status_code')
});

export default LogSummarySectionView;
