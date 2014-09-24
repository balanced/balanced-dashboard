import Ember from "ember";
import actionEvented from "./mixins/action-evented";

var EventMixin = actionEvented('openDebitFundingInstrumentModal', 'openCreditFundingInstrumentModal', 'openVerifyBankAccountModal', 'openConfirmVerificationModal');

var BankAccountsController = Ember.ObjectController.extend(EventMixin, {
	needs: ['marketplace'],
});

export default BankAccountsController;
