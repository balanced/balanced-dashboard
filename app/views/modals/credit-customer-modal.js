import ObjectCreatorModalBaseView from "./object-creator-modal-base";
import Ember from "ember";
import CreditExistingFundingInstrumentTransactionFactory from "balanced-dashboard/models/factories/credit-existing-funding-instrument-transaction-factory";

var CreditCustomerModalView = ObjectCreatorModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	title: "Credit this customer",
	elementId: "credit-customer",
	templateName: "modals/credit-customer-modal",

	appearsOnStatementAsMaxLength: Ember.computed.oneWay("model.appears_on_statement_max_length"),
	model_class: CreditExistingFundingInstrumentTransactionFactory,
	fundingInstruments: Ember.computed.oneWay('customer.creditable_funding_instruments'),
});

CreditCustomerModalView.reopenClass({
	open: function(customer) {
		return this.create({
			customer: customer
		});
	},
});

export default CreditCustomerModalView;
