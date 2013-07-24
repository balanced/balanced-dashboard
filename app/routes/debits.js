Balanced.DebitsIndexRoute = Balanced.AuthRoute.extend({
    redirect: function () {
        this.transitionTo('activity.transactions');
    }
});

Balanced.DebitsRoute = Balanced.AuthRoute.extend({
	title: 'Debit',

	model: function (params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var debitUri = marketplace.get('debits_uri') + '/' + params.debit_id;
			return Balanced.Debit.find(debitUri);
		});
	}
});
