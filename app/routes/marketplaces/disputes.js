Balanced.DisputesRoute = Balanced.ControllerRoute.extend({
	pageTitle: 'Disputes'
});

Balanced.DisputeRoute = Balanced.ModelRoute.extend({
	title: 'Dispute',
	modelObject: Balanced.Dispute,
	marketplaceUri: 'disputes_uri'
});
