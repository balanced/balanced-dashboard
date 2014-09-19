var Wide = Balanced.Modals.WideModalMixin;
var Save = Balanced.Modals.ObjectActionMixin;

Balanced.Modals.CustomerDebitCreateModalView = Balanced.ModalBaseView.extend(Wide, Save, {
	elementId: "debit-customer",
	templateName: "modals/customer_debit_create_modal",
	title: "Debit this customer",

	appearsOnStatementAsMaxLength: Ember.computed.oneWay("model.appears_on_statement_max_length"),
	appearsOnStatementAsLabel: function() {
		var length = this.get("appearsOnStatementAsMaxLength");
		return "Appears on statement as (%@ characters max)".fmt(length);
	}.property("appearsOnStatementAsMaxLength"),

	model: function() {
		return Balanced.DebitExistingFundingInstrumentTransactionFactory.create({
			customer: this.get("customer")
		});
	}.property("customer"),
	fundingInstruments: Ember.computed.oneWay('customer.debitable_funding_instruments'),

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

Balanced.Modals.CustomerDebitCreateModalView.reopenClass({
	open: function(customer, order) {
		return this.create({
			customer: customer,
			order: order
		});
	},
});
