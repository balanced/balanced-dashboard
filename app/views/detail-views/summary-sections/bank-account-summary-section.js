import SummarySectionView from "./summary-section";
import Utils from "balanced-dashboard/lib/utils";

var BankAccountSummarySectionView = SummarySectionView.extend({
	statusText: function() {
		var status = this.get('status');

		if (status === 'pending') {
			return 'Two deposits have been made to your bank account. Confirm verification by entering the amounts.';
		} else if (status === 'unverified') {
			return 'You may only credit to this bank account. You must verify this bank account to debit from it.';
		} else if (status === 'unverifiable') {
			return 'You may only credit to this bank account. This bank account is unverifiable because it\'s not associated with a customer.';
		} else if (status === 'failed') {
			return 'We could not verify your bank account. You may restart the verification process after three business days after %@.'.fmt(Utils.humanReadableDateShort(this.get('model.verification.updated_at')));
		}

		return undefined;
	}.property('status', 'model.verification.updated_at'),

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
