import ModalBaseView from "./modal-base";
import Constants from "balanced-dashboard/utils/constants";
import Wide from "balanced-dashboard/views/modals/mixins/wide-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";

var CardDebitCreateModalView = ModalBaseView.extend(Save, Wide, {
	title: "Debit a card",
	templateName: "modals/card-debit-create-modal",
	elementId: "charge-card",

	model: function() {
		var DebitCardTransactionFactory = require("balanced-dashboard/models/factories/debit-card-transaction")['default'];
		return DebitCardTransactionFactory.create();
	}.property(),
	appearsOnStatementAsMaxLength: Constants.MAXLENGTH.APPEARS_ON_STATEMENT_CARD,
	appearsOnStatementAsLabel: function() {
		var length = this.get("appearsOnStatementAsMaxLength");
		return "Appears on statement as (%@ characters max)".fmt(length);
	}.property("appearsOnStatementAsMaxLength"),

	validMonths: Constants.TIME.MONTHS,
	validYears: function() {
		var years = [];
		var currentYear = (new Date()).getFullYear();
		return _.times(10, function(i) {
			return currentYear + i;
		});
	}.property(),

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
