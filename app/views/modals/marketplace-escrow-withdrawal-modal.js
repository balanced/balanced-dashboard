import Ember from "ember";
import ModalBaseView from "./modal-base";
import Constants from "balanced-dashboard/utils/constants";
import CreditExistingFundingInstrumentTransactionFactory from "balanced-dashboard/models/factories/credit-existing-funding-instrument-transaction-factory";

var MarketplaceEscrowWithdrawalModalView = ModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	elementId: 'withdraw-funds',
	templateName: 'modals/marketplace_escrow_withdrawal_modal',
	title: "Withdraw Funds",

	appearsOnStatementAsMaxLength: Constants.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,
	appearsOnStatementAsLabel: function() {
		var length = this.get("appearsOnStatementAsMaxLength");
		return "Appears on statement as (%@ characters max)".fmt(length);
	}.property("appearsOnStatementAsMaxLength"),

	bank_accounts: Ember.computed.readOnly('marketplace.owner_customer.bank_accounts'),
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

MarketplaceEscrowWithdrawalModalView.reopenClass({
	open: function(marketplace) {
		return this.create({
			marketplace: marketplace
		});
	}
});

export default MarketplaceEscrowWithdrawalModalView;
