Balanced.RefundsRoute = Balanced.AuthRoute.extend({
	title: 'Refund',

	pageTitle: function(route, setTitle) {
		var refund = route.controller.content;
		return Balanced.Utils.maybeDeferredLoading(refund, setTitle, function() {
			return 'Refund: loading ...';
		}, function() {
			return 'Refund: %@'.fmt(refund.get('page_title'));
		});
	},

	model: function(params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var refundUri = Balanced.Utils.combineUri(marketplace.get('refunds_uri'), params.refund_id);
			return Balanced.Refund.find(refundUri);
		});
	}
});
