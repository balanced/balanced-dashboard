import SummarySectionView from "./summary-section";

var LogSummarySectionView = SummarySectionView.extend({
	status: Ember.computed.reads("model.status_code"),
	statusText: Ember.computed.reads("model.additional"),
	statusClassName: Ember.computed.reads("model.status"),

	linkedResources: function() {
		return this.resourceLinks("model.order", "model.debit", "model.credit", "model.refund", "model.reversal", "model.hold", "model.customer", "model.card", "model.bank_account");
	}.property("model.order", "model.debit", "model.credit", "model.refund", "model.reversal", "model.hold", "model.customer", "model.card", "model.bank_account")
});

export default LogSummarySectionView;
