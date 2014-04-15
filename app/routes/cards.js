Balanced.CardsIndexRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		this.transitionTo('activity.funding_instruments', this.modelFor('marketplace'));
	}
});

Balanced.CardsRoute = Balanced.ModelControllerRoute.extend({
	title: 'Card',
	modelObject: Balanced.Card,
	marketplaceUri: 'cards_uri'
});
