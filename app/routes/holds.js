Balanced.HoldsRoute = Balanced.AuthRoute.extend({
	title: 'Hold',

    pageTitle: function (route, setTitle) {
        var hold = route.controller.content;
        return Balanced.Utils.maybeDeferredLoading(hold, setTitle, function () {
            return 'Hold: loading ...';
        }, function () {
            return 'Hold: Order #{0}'.format(hold.get('id'));
        });
    },

	model: function (params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var holdUri = Balanced.Utils.combineUri(marketplace.get('holds_uri'), params.hold_id);
			return Balanced.Hold.find(holdUri);
		});
	}
});
