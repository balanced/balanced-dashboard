import Ember from "ember";
import CreditExistingFundingInstrumentTransactionFactory from "balanced-dashboard/models/factories/credit-existing-funding-instrument-transaction-factory";
import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-validate-and-save-mixin";

var CreditCustomerModalView = ModalBaseView.extend(Full, Form, Save, {
	templateName: "modals/credit-customer-modal",
	elementId: "credit-customer",
	title: "Credit this customer",
	cancelButtonText: "Cancel",
	submitButtonText: "Credit",

	model: function() {
		return CreditExistingFundingInstrumentTransactionFactory.create({
			customer: this.get("customer")
		});
	}.property("customer"),

	appearsOnStatementAsMaxLength: Ember.computed.oneWay("model.appears_on_statement_max_length"),
	appearsOnStatementAsLabelText: function() {
		var length = this.get("appearsOnStatementAsMaxLength");
		return "Appears on statement as (%@ characters max)".fmt(length);
	}.property("appearsOnStatementAsMaxLength"),

	fundingInstruments: Ember.computed.oneWay('customer.creditable_funding_instruments'),

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

CreditCustomerModalView.reopenClass({
	open: function(customer, order) {
		return this.create({
			customer: customer,
			order: order
		});
	},
});

export default CreditCustomerModalView;
