Balanced.FundingInstrumentModalView = Balanced.ModalView.extend({
	dollar_amount: null,

	open: function(model) {
		this.set('dollar_amount', null);
		this._super(model);
	},

	beforeSave: function(model) {
		var cents = null;

		try {
			cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
		} catch (error) {
			model.set('validationErrors', {
				'amount': error
			});

			return false;
		}

		model.set('amount', cents);
	},

	afterSave: function(model) {
		this.get('controller').transitionToRoute(model.get('route_name'), model);
	}
});
