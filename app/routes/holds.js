Balanced.HoldsRoute = Balanced.AuthRoute.extend({
	title: 'Hold',

	pageTitle: function(route, setTitle) {
		var hold = route.controller.content;
		return Balanced.Utils.maybeDeferredLoading(hold, setTitle, function() {
			return 'Hold: loading ...';
		}, function() {
			return 'Hold: %@'.fmt(hold.get('page_title'));
		});
	},

	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var holdUri = Balanced.Utils.combineUri(marketplace.get('hold_cards_uri'), params.hold_id);
			return Balanced.Hold.find(holdUri);
		});
	}
});
