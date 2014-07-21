var EventMixin = Balanced.ActionEvented('openDebitFundingInstrumentModal', 'openCreditFundingInstrumentModal', 'openVerifyBankAccountModal', 'openConfirmVerificationModal');

Balanced.BankAccountsController = Balanced.ObjectController.extend(EventMixin, {
	needs: ['marketplace'],

	actions: {}
});
