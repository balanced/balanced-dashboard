import SummarySectionView from "./summary-section";

var BankAccountSummarySectionView = SummarySectionView.extend({
	statusText: function() {
		var status = this.get('status');

		if (status === 'pending') {
			return 'Two deposits have been made to your bank account. Confirm verification by entering the amounts.';
		} else if (status === 'unverified') {
			return 'You may only credit to this bank account. You must verify this bank account to debit from it.';
		} else if (status === 'unverifiable') {
			return 'You may only credit to this bank account. This bank account is unverifiable because it\'s not associated with a customer.';
		}
		return undefined;
	}.property('status'),

	statusButtonModalView: function() {
		var status = this.get('status');
		if (status === 'unverified') {
			return this.get("container").lookupFactory("view:modals/verify-bank-account-modal");
		} else if (status === 'pending') {
			return this.get("container").lookupFactory("view:modals/bank-account-verification-confirm-modal");
		}
		return undefined;
	}.property('status'),

	statusButtonText: function() {
		var status = this.get('status');
		if (status === 'unverified' || status === 'pending') {
			return "Verify";
		}
		return undefined;
	}.property("status"),

	linkedResources: function() {
		return this.resourceLinks("model.customer");
	}.property('model.customer'),
});

export default BankAccountSummarySectionView;
