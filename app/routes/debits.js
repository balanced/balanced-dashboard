Balanced.DebitsRoute = Balanced.AuthRoute.extend({
	title: 'Debit',

	pageTitle: function(route, setTitle) {
		var debit = route.controller.content;
		return Balanced.Utils.maybeDeferredLoading(debit, setTitle, function() {
			return 'Debit: loading ...';
		}, function() {
			return 'Debit: %@'.fmt(debit.get('page_title'));
		});
	},

	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var debitUri = Balanced.Utils.combineUri(marketplace.get('debits_uri'), params.debit_id);
			return Balanced.Debit.find(debitUri);
		});
	}
});
