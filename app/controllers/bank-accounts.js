import Ember from "ember";

var EventMixin = Balanced.ActionEvented('openDebitFundingInstrumentModal', 'openCreditFundingInstrumentModal', 'openVerifyBankAccountModal', 'openConfirmVerificationModal');

var BankAccountsController = Ember.ObjectController.extend(EventMixin, {
	needs: ['marketplace'],
});

export default BankAccountsController;
