import Ember from "ember";
import Credit from "balanced-dashboard/models/credit";
import BaseFundingInstrumentModalView from "./base-funding-instrument-modal";

var WithdrawFundsModalView = BaseFundingInstrumentModalView.extend({
	templateName: 'modals/withdraw-funds',
	controllerEventName: 'openWithdrawFundsModal',
	modalElement: '#withdraw-funds',

	submitAction: 'submitCreditCustomer',
	dollar_amount: null,

	open: function() {
		var self = this;
		var credit = Credit.create({
			amount: null,
			description: null
		});

		self.set('dollar_amount', null);
		self._super(credit);
	},

	afterSave: function(model) {
		this.get('controller').transitionToRoute("credits", model);
	},

	actions: {
		save: function() {
			var credit = this.get('model');
			credit.set("uri", this.get("destination.credits_uri"));
			this._super(credit);
		}
	},

	// Note: sendAction is a component method and the BaseModal#save assumes that we are a component
	// We need to stub this so that BaseModal#save doesn't break.
	sendAction: function() {},

	destination: function() {
		var fundingInstruments = this.get('bank_accounts');
		var destinationUri = this.get('destination_uri');
		if (fundingInstruments) {
			var destination = fundingInstruments.find(function(destination) {
				return destinationUri === destination.get('uri');
			});
			return destination || fundingInstruments.objectAt(0);
		} else {
			return null;
		}

	}.property('destination_uri', 'bank_accounts', 'bank_accounts.isLoaded'),

	bank_accounts: Ember.computed.readOnly('marketplace.owner_customer.bank_accounts')
});

export default WithdrawFundsModalView;
