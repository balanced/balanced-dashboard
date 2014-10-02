import Ember from "ember";
import Utils from "balanced-dashboard/lib/utils";
import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Constants from "balanced-dashboard/utils/constants";
import CreditExistingFundingInstrumentTransactionFactory from "balanced-dashboard/models/factories/credit-existing-funding-instrument-transaction-factory";

var WithdrawFundsModalView = ModalBaseView.extend(Full, Form, {
	templateName: 'modals/withdraw-funds-modal',
	elementId: 'withdraw-funds',
	title: "Withdraw Funds",
	cancelButtonText: "Cancel",
	submitButtonText: "Withdraw",

	appearsOnStatementAsMaxLength: Constants.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,
	appearsOnStatementAsLabelText: function() {
		var length = this.get("appearsOnStatementAsMaxLength");
		return "Appears on statement as (%@ characters max)".fmt(length);
	}.property("appearsOnStatementAsMaxLength"),

	bankAccounts: Ember.computed.readOnly('marketplace.owner_customer.bank_accounts'),
	availableBalance: function() {
		return 'Available balance: $%@'.fmt(Utils.centsToDollars(this.get("marketplace.in_escrow")));
	}.property("marketplace.in_escrow"),

	model: function() {
		return CreditExistingFundingInstrumentTransactionFactory.create();
	}.property(),

	isSaving: false,
	actions: {
		save: function() {
			var self = this;
			this.set("isSaving", true);
			this.get('model')
				.validateAndSave()
				.then(function(model) {
					self.set("isSaving", false);
					self.get("controller").transitionToRoute(model.get("route_name"), model);
					self.close();
				}, function(errors) {
					self.set("isSaving", false);
				});
		}
	}
});

WithdrawFundsModalView.reopenClass({
	open: function(marketplace) {
		return this.create({
			marketplace: marketplace
		});
	}
});

export default WithdrawFundsModalView;
