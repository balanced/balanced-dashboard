Balanced.Modals.RefundDebitModalView = Balanced.ModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	templateName: 'modals/refund_debit_modal',
	elementId: "refund-debit",
	title: function() {
		return "Refund this %@".fmt(this.get("recipient"));
	}.property("recipient"),

	recipient: Ember.computed.oneWay("debit.recipient"),
	recipientLabel: function() {
		return this.get("recipient").capitalize();
	}.property("recipient"),

	recipientDisplay: Ember.computed.oneWay("debit.recipient_name"),

	model: function() {
		return Balanced.RefundDebitTransactionFactory.create({
			dollar_amount: this.get("debit.dollar_amount"),
			debit: this.get("debit")
		});
	}.property("debit"),

	isSaving: false,

	actions: {
		save: function() {
			var self = this;
			this.set("isSaving", true);
			this.get("model")
				.save()
				.then(function(reversal) {
					self.set("isSaving", false);
					self.get("controller").transitionToRoute(reversal.get("route_name"), reversal);
					self.close();
				}, function(errors) {
					self.set("isSaving", false);
				});
		},
	}
});

Balanced.Modals.RefundDebitModalView.reopenClass({
	open: function(debit) {
		return this.create({
			debit: debit
		});
	}
});
