import Ember from "ember";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";
import ModalBaseView from "./modal-base";
import DebitExistingFundingInstrumentTransactionFactory from "balanced-dashboard/models/factories/debit-existing-funding-instrument-transaction-factory";

var DebitCustomerModalView = ModalBaseView.extend(Full, Form, Save, {
	templateName: "modals/debit-customer-modal",
	elementId: "debit-customer",
	title: "Debit this customer",
	cancelButtonText: "Cancel",
	submitButtonText: "Debit",

	appearsOnStatementAsMaxLength: Ember.computed.oneWay("model.appears_on_statement_max_length"),
	appearsOnStatementAsLabelText: function() {
		var length = this.get("appearsOnStatementAsMaxLength");
		return "Appears on statement as (%@ characters max)".fmt(length);
	}.property("appearsOnStatementAsMaxLength"),

	model: function() {
		return DebitExistingFundingInstrumentTransactionFactory.create({
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

DebitCustomerModalView.reopenClass({
	open: function(customer, order) {
		return this.create({
			customer: customer,
			order: order
		});
	},
});

export default DebitCustomerModalView;
