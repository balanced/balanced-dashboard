Balanced.ChargeCardModalView = Balanced.FundingInstrumentModalView.extend({
	controllerEventName: 'openChargeCardModal',
	modalElement: '#charge-card',
	templateName: 'modals/charge_card',

	expiration_error: Balanced.computed.orProperties('model.validationErrors.expiration_month', 'model.validationErrors.expiration_year'),

	open: function() {
		var debit = Balanced.Debit.create();
		debit.set('source', Balanced.Card.create());
		this._super(debit);
	}
});
