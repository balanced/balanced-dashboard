Balanced.ReversalsRoute = Balanced.AuthRoute.extend({
	title: 'Reversal',

	model: function (params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var reversalUri = Balanced.Utils.combineUri(marketplace.get('reversals_uri'), params.reversal_id);
			return Balanced.Reversal.find(reversalUri);
		});
	}
});
