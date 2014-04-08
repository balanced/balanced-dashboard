Balanced.DisputesIndexController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
	needs: ['marketplace'],

	baseClassSelector: "#dispute",

	results_base_uri: function() {
		return Balanced.Dispute.create().get('uri');
	}.property()
});

Balanced.DisputesDisputeController = Balanced.ObjectController.extend(
	Ember.Evented, {
		needs: ['marketplace'],

		init: function() {
			var self = this;
			Balanced.Model.Events.on('didCreate', function(object) {
				if (Balanced.Transaction.prototype.isPrototypeOf(object)) {
					self.send('reload');
				}
			});
		},

		results_base_uri: Ember.computed.alias('controllers.marketplace.disputes_uri')
	}
);
