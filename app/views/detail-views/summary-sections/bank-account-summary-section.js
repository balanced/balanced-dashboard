import SummarySectionView from "./summary-section";
import Utils from "balanced-dashboard/lib/utils";

var BankAccountSummarySectionView = SummarySectionView.extend({
	verificationRestartDate: Ember.computed("model.verification.updated_at", function() {
		var updatedAtDate = this.get("model.verification.updated_at");
		return moment(new Date(updatedAtDate)).add(3, "days").toDate();
	}),

	statusText: function() {
		var status = this.get('model.status');

		if (status === 'pending') {
			return 'Two deposits have been made to your bank account. Confirm verification by entering the amounts.';
		}
		else if (status === 'unverified') {
			return 'You may only credit to this bank account. You must verify this bank account to debit from it.';
		}
		else if (status === 'unverifiable') {
			return 'You may only credit to this bank account. This bank account is unverifiable because it\'s not associated with a customer.';
		}
		else if (status === 'failed') {
			return 'We could not verify your bank account. You may restart the verification process after %@.'.fmt(Utils.humanReadableDate(this.get('verificationRestartDate')));
		}

		return undefined;
	}.property('model.status', 'verificationRestartDate'),

	statusButtonModalView: function() {
		var container = this.get("container");
		if (this.get("isCanStartVerification")) {
			return container.lookupFactory("view:modals/verify-bank-account-modal");
		} else if (this.get("isCanConfirmVerification")) {
			return container.lookupFactory("view:modals/bank-account-verification-confirm-modal");
		}
		return undefined;
	}.property('isCanStartVerification', "isCanConfirmVerification"),

	isCanStartVerification: Ember.computed("model.status", "verificationRestartDate", function() {
		var status = this.get("model.status");
		return status === "unverified" || (status === "failed" && this.get("verificationRestartDate") < new Date());
	}),

	isCanConfirmVerification: Ember.computed.equal("model.status", "pending"),

	statusButtonText: function() {
		if (this.get("isCanStartVerification") || this.get("isCanConfirmVerification")) {
			return "Verify";
		}
		return undefined;
	}.property("isCanStartVerification", "isCanConfirmVerification"),

	linkedResources: function() {
		return this.resourceLinks("model.customer");
	}.property('model.customer'),
});

export default BankAccountSummarySectionView;
