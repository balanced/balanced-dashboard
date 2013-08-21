Balanced.CreditsRoute = Balanced.AuthRoute.extend({
	title: 'Credit',

	model: function (params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var creditUri = Balanced.Utils.combineUri(marketplace.get('credits_uri'), params.credit_id);
			return Balanced.Credit.find(creditUri);
		});
	}
});
