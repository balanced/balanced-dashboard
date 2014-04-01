Balanced.HoldCardModalView = Balanced.ModalView.extend({
	templateName: 'modals/hold_card',
	controllerEventName: 'openHoldCardModal',
	modalElement: '#hold-card',

	open: function() {
		var hold = Balanced.Hold.create({
			uri: this.get('funding_instrument.card_holds_uri'),
			source_uri: this.get('funding_instrument.uri'),
			amount: null
		});

		this._super(hold);
	}
});
