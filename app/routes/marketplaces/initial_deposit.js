Balanced.MarketplaceInitialDepositRoute = Balanced.AuthRoute.extend({
	model: function() {
		var marketplace = this.modelFor('marketplace');

		return Balanced.Card.create({
			uri: marketplace.get('owner_customer.cards_uri'),
			isLoaded: true,
			isNew: false
		});
	},
	actions: {
		onComplete: function() {
			var marketplace = this.modelFor('marketplace');
			this.transitionTo('activity', marketplace);
		},
		onSubmit: function(card, debit) {
			var marketplace = this.modelFor('marketplace');
			var self = this;

			card.tokenizeAndCreate().then(function() {
				debit.set('uri', card.get('debits_uri'));
				debit.set('source_uri', card.get('uri'));
				debit.save().then(function(debit) {
					self.transitionTo('activity', marketplace);
				});
			});
		},
		onSkip: function() {
			var marketplace = this.modelFor('marketplace');
			marketplace.reload();
			this.transitionTo('activity', marketplace);
		}
	}
});
