Balanced.MarketplaceInitialDepositController = Balanced.ObjectController.extend({
	needs: ['marketplace'],
	loadingMessage: 'Verifying...',

	expirationMonths: Balanced.TIME.MONTHS,

	actions: {
		submit: function() {
			var card = this.get('model');

			if (card.validate()) {
				var debit = Balanced.Debit.create({
					amount: this.get('initial_amount') * 100
				});

				var proxy = $.proxy(this.onDebitFailed, this);
				card.one('becameInvalid', proxy);
				card.one('becameError', proxy);
				debit.one('becameInvalid', proxy);
				debit.one('becameError', proxy);

				this.send('onSubmit', card, debit);
			}
		},

		skip: function() {
			this.send('onSkip');
		}
	},

	expirationYears: function() {
		var start = new Date().getFullYear();
		var years = Ember.A();
		for (var i = 0; i < 10; i++) {
			years.push(start + i);
		}
		return years;
	}.property(),

	initialAmounts: [{
		amount: 10,
		formatted: '$10.00'
	}, {
		amount: 25,
		formatted: '$25.00'
	}, {
		amount: 50,
		formatted: '$50.00'
	}, {
		amount: 100,
		formatted: '$100.00'
	}],

	onDebitFailed: function() {
		this.send('alert', {
			message: 'Sorry, there was an error charging this card.',
			type: 'error'
		});
	}
});
