Balanced.DebitsRoute = Balanced.AuthRoute.extend({
	title: 'Debit',

	model: function (params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var debitUri = Balanced.Utils.combineUri(marketplace.get('debits_uri'), params.debit_id);
			return Balanced.Debit.find(debitUri);
		});
	}
});
