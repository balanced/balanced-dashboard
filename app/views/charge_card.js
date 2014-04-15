Balanced.ChargeCardModalView = Balanced.ModalView.extend({
	controllerEventName: 'openChargeCardModal',
	modalElement: '#charge-card',
	templateName: 'modals/charge_card',
	amount_dollars: 0,

	open: function() {
		var credit = Balanced.Credit.create();
		credit.set('destination', Balanced.BankAccount.create({
			'type': 'checking'
		}));
		this.set('amount_dollars', null);

		this._super(credit);
	},


	afterSave: function() {
		this.get('controller').transitionToRoute('credits', this.get('model'));
	},

	beforeSave: function() {
		var credit = this.get('model');

		var cents = null;
		try {
			cents = Balanced.Utils.dollarsToCents(this.get('amount_dollars'));
		} catch (error) {
			credit.set('validationErrors', {
				'amount': error
			});
			return false;
		}

		credit.set('amount', cents);
	}
});
