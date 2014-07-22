Balanced.Modals.DebitCustomerModalView = Balanced.ModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	elementId: "debit-customer",
	templateName: "modals/debit_customer_modal",
	title: "Debit this customer",

	appearsOnStatementAsMaxLength: Ember.computed.oneWay("model.appears_on_statement_max_length"),
	appearsOnStatementAsLabel: function() {
		var length = this.get("appearsOnStatementAsMaxLength");
		return "Appears on statement as (%@ characters max)".fmt(length);
	}.property("appearsOnStatementAsMaxLength"),

	model: function() {
		return Balanced.DebitExistingFundingInstrumentTransactionFactory.create({
			customer: this.get("customer")
		})
	}.property("customer"),
	fundingInstruments: Ember.computed.oneWay('customer.debitable_funding_instruments'),

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

Balanced.Modals.DebitCustomerModalView.reopenClass({
	open: function(customer, order) {
		return this.create({
			customer: customer,
			order: order
		});
	},
});
