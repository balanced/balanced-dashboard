Balanced.ReversalsRoute = Balanced.AuthRoute.extend({
	title: 'Reversal',

	pageTitle: function(route, setTitle) {
		var reversal = route.controller.content;
		return Balanced.Utils.maybeDeferredLoading(reversal, setTitle, function() {
			return 'Reversal: loading ...';
		}, function() {
			return 'Reversal: %@'.fmt(reversal.get('page_title'));
		});
	},

	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var reversalUri = Balanced.Utils.combineUri(marketplace.get('reversals_uri'), params.reversal_id);
			return Balanced.Reversal.find(reversalUri);
		});
	}
});
