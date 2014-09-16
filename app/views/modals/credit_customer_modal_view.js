Balanced.CreditCustomerModalView = Balanced.ObjectCreatorModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	title: "Credit this customer",
	elementId: "credit-customer",
	templateName: "modals/credit_customer_modal",

	appearsOnStatementAsMaxLength: Ember.computed.oneWay("model.appears_on_statement_max_length"),
	model_class: Balanced.CreditExistingFundingInstrumentTransactionFactory,
	fundingInstruments: Ember.computed.oneWay('customer.creditable_funding_instruments'),
});

Balanced.CreditCustomerModalView.reopenClass({
	open: function(customer, order) {
		return this.create({
			customer: customer,
			order: order
		});
	},
});
