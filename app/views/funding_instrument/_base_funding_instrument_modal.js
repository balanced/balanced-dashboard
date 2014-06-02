Balanced.FundingInstrumentModalView = Balanced.ModalView.extend({
	dollar_amount: null,

	open: function(model) {
		this.set('dollar_amount', null);
		this._super(model);
	},

	beforeSave: function(model) {
		var cents = null;

		model.setProperties({
			validationErrors: undefined,
			isValid: true
		});

		try {
			cents = Balanced.Utils.dollarsToCents(this.get('dollar_amount'));
		} catch (error) {
			model.setProperties({
				validationErrors: {
					amount: error
				},
				isValid: false
			});

			return false;
		}

		model.set('amount', cents);
		return true;
	},

	afterSave: function(model) {
		this.get('controller').transitionToRoute(model.get('route_name'), model);
	}
});
