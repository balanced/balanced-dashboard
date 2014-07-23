Balanced.Modals.ReverseCreditModalView = Balanced.ModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	elementId: "reverse-credit",
	templateName: 'modals/reverse_credit_modal',
	title: "Reverse credit",

	model: function() {
		return Balanced.ReverseCreditTransactionFactory.create({
			dollar_amount: this.get("credit.dollar_amount"),
			credit: this.get("credit")
		});
	}.property("credit"),

	customerDisplay: function() {
		var customer = this.get("credit.customer");

		if (customer) {
			var displayMe = customer.get("display_me");
			var email = customer.get("email");

			return Ember.isBlank(displayMe) ?
				displayMe :
				"%@ (%@)".fmt(displayMe, email);
		}
	}.property("credit.customer.display_me", "credit.customer.email"),

	isSaving: false,

	actions: {
		save: function() {
			var self = this;
			this.set("isSaving", true);
			this.get("model")
				.save()
				.then(function(model) {
					self.set("isSaving", false);
					self.get("controller").transitionToRoute(model.get("route_name"), model);
					self.close();
				}, function(errors) {
					self.set("isSaving", false);
				});
		},
	}
});

Balanced.Modals.ReverseCreditModalView.reopenClass({
	open: function(credit) {
		return this.create({
			credit: credit
		});
	}
});
