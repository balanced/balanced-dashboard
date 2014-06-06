Balanced.CardsIndexRoute = Balanced.RedirectRoute('activity.funding_instruments');

Balanced.CardsRoute = Balanced.ModelControllerRoute.extend({
	title: 'Card',
	modelObject: Balanced.Card,
	marketplaceUri: 'cards_uri'
});
