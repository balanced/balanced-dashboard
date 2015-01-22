import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";
import Constants from "balanced-dashboard/utils/constants";
import CreditBankAccountTransactionFactory from "balanced-dashboard/models/factories/credit-bank-account-transaction-factory";

var BankAccountCreditCreateModalView = ModalBaseView.extend(Save, Full, Form, {
	templateName: "modals/bank-account-credit-create-modal",
	elementId: "pay-seller",
	title: "Credit a bank account",
	cancelButtonText: "Cancel",
	submitButtonText: "Credit",

	model: function() {
		return this.container.lookup("model:factories/credit-bank-account-transaction-factory");
	}.property(),

	bankAccountTypes: Constants.BANK_ACCOUNT_TYPES.map(function(name) {
		return {
			value: name.toLowerCase(),
			label: name
		};
	}),

	appearsOnStatementAsLabelText: function() {
		var length = this.get("appearsOnStatementAsMaxLength");
		return "Appears on statement as (%@ characters max)".fmt(length);
	}.property("appearsOnStatementAsMaxLength"),

	appearsOnStatementAsMaxLength: Constants.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,

	actions: {
		save: function() {
			var controller = this.get("controller");
			this.save(this.get("model"))
				.then(function(model) {
					controller.transitionToRoute(model.get("route_name"), model);
				});
		},
	}
});

export default BankAccountCreditCreateModalView;
