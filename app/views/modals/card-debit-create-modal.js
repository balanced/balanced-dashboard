import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Constants from "balanced-dashboard/utils/constants";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";

var CardDebitCreateModalView = ModalBaseView.extend(Save, Full, Form, {
	templateName: "modals/card-debit-create-modal",
	elementId: "charge-card",
	title: "Debit a card",
	cancelButtonText: "Cancel",
	submitButtonText: "Debit",

	model: function() {
		var DebitCardTransactionFactory = require("balanced-dashboard/models/factories/debit-card-transaction-factory")['default'];
		return DebitCardTransactionFactory.create();
	}.property(),

	appearsOnStatementAsMaxLength: Constants.MAXLENGTH.APPEARS_ON_STATEMENT_CARD,

	appearsOnStatementAsLabelText: function() {
		var length = this.get("appearsOnStatementAsMaxLength");
		return "Appears on statement as (%@ characters max)".fmt(length);
	}.property("appearsOnStatementAsMaxLength"),

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

export default CardDebitCreateModalView;
