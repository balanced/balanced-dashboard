Balanced.PaySellerModalView = Balanced.FundingInstrumentModalView.extend({
	controllerEventName: 'openPaySellerModal',
	modalElement: '#pay-seller',
	templateName: 'modals/pay_seller',

	open: function() {
		var credit = Balanced.Credit.create();
		credit.set('destination', Balanced.BankAccount.create({
			'type': 'checking'
		}));
		this._super(credit);
	}
});
