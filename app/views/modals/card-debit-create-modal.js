import Wide from "balanced-dashboard/views/modals/mixins/wide-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";

Balanced.Modals.CardDebitCreateModalView = Balanced.ModalBaseView.extend(Save, Wide, {
	title: "Debit a card",
	templateName: "modals/card_debit_create_modal",
	elementId: "charge-card",

	model: function() {
		return Balanced.DebitCardTransactionFactory.create();
	}.property(),
	appearsOnStatementAsMaxLength: Balanced.MAXLENGTH.APPEARS_ON_STATEMENT_CARD,
	appearsOnStatementAsLabel: function() {
		var length = this.get("appearsOnStatementAsMaxLength");
		return "Appears on statement as (%@ characters max)".fmt(length);
	}.property("appearsOnStatementAsMaxLength"),

	validMonths: Balanced.TIME.MONTHS,
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
