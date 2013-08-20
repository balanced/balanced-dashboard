Balanced.HoldsIndexRoute = Balanced.AuthRoute.extend({
	redirect: function () {
		this.transitionTo('activity.transactions');
	}
});

Balanced.HoldsRoute = Balanced.AuthRoute.extend({
	title: 'Hold',

	model: function (params) {
		var marketplace = this.modelFor('marketplace');
		return marketplace.then(function(marketplace) {
			var holdUri = Balanced.Utils.combineUri(marketplace.get('holds_uri'), params.hold_id);
			return Balanced.Hold.find(holdUri);
		});
	},

	events: {
		submitCaptureHold: function(debit) {
			var self = this;
			debit.create().then(function (debit) {
				self.transitionTo('debits', debit);
			});
		}
	}
});
