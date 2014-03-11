// Requires the results_table mixin also, but there's no inheritance allowed for mixins
Balanced.TransactionsTable = Ember.Mixin.create({
	isDisputeType: Ember.computed.equal('type', 'dispute'),

	extra_filtering_params: {
		'status[in]': 'failed,succeeded,pending'
	},

	results_base_uri: function() {
		if (this.get('isDisputeType')) {
			return '/disputes';
		}

		return this._super();
	}.property('type', 'controllers.marketplace.uri')
});
