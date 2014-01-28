Balanced.DisputesRoute = Balanced.AuthRoute.extend({
	title: 'Dispute',

	pageTitle: function(route, setTitle) {
		var dispute = route.controller.content;
		return Balanced.Utils.maybeDeferredLoading(dispute, setTitle, function() {
			return 'Dispute: loading ...';
		}, function() {
			return 'Dispute: %@'.fmt(debit.get('page_title'));
		});
	},

	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var disputeUri = Balanced.Utils.combineUri(marketplace.get('disputes_uri'), params.dispute_id);
			console.log('disputeUri', disputeUri);
			return Balanced.Dispute.find(disputeUri);
		});
	}
});
