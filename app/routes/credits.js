Balanced.CreditsRoute = Balanced.AuthRoute.extend({
	title: 'Credit',

    pageTitle: function (route, setTitle) {
        var credit = route.controller.content;
        return Balanced.Utils.maybeDeferredLoading(credit, setTitle, function () {
            return 'Credit: loading ...';
        }, function () {
            return 'Credit: Order #{0}'.format(credit.get('id'));
        });
    },

	model: function (params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var creditUri = Balanced.Utils.combineUri(marketplace.get('credits_uri'), params.credit_id);
			return Balanced.Credit.find(creditUri);
		});
	}
});