Balanced.RefundsRoute = Balanced.AuthRoute.extend({
	title: 'Refund',

	model: function (params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var refundUri = Balanced.Utils.combineUri(marketplace.get('refunds_uri'), params.refund_id);
			return Balanced.Refund.find(refundUri);
		});
	}
});
