import Ember from "ember";
import CreditExistingFundingInstrumentTransactionFactory from "balanced-dashboard/models/factories/credit-existing-funding-instrument-transaction-factory";
import CreditCustomerModalView from "./credit-customer-modal";

var CreditOrderModalView = CreditCustomerModalView.extend({
	templateName: "modals/credit-order-modal",
	elementId: "credit-order",
	title: "Credit this order",

	model: function() {
		return CreditExistingFundingInstrumentTransactionFactory.create({
			customer: this.get("recipient"),
			order:this.get("order")
		});
	}.property("recipient", "order"),

	fromText: function() {
		return "Order balance (%@)".fmt(this.get("order.escrow_balance"));
	}.property("order.escrow_balance"),

	merchantCustomer: Ember.computed.reads("order.seller"),
	ownerCustomer: Ember.computed.reads("marketplace.owner_customer"),

	recipientKey: "merchant",
	recipients: function() {
		return [{
				value: "merchant",
				label: "Merchant: %@".fmt(this.get("merchantCustomer.display_me"))
			}, {
				value: "marketplace",
				label: "Marketplace: %@".fmt(this.get("ownerCustomer.display_me"))
			}
		];
	}.property("ownerCustomer", "merchantCustomer"),

	recipient: function() {
		if (this.get("recipientKey") === "merchant") {
			return this.get("merchantCustomer");
		} else {
			return this.get("ownerCustomer");
		}
	}.property("recipientKey", "seller"),

	fundingInstruments: Ember.computed.reads("recipient.creditable_funding_instruments"),

	nameOnAccount: function() {
		var nameOnAccount = this.get("model.destination.name");
		if (nameOnAccount) {
			return "Name on account: %@".fmt(nameOnAccount);
		}
		return undefined;
	}.property("model.destination.name"),

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

CreditOrderModalView.reopenClass({
	open: function(order, marketplace) {
		return this.create({
			order: order,
			marketplace: marketplace
		});
	},
});

export default CreditOrderModalView;
