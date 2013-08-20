Balanced.RefundsController = Balanced.ObjectController.extend(
    Ember.Evented,
    {
        needs: ['marketplace'],

		refunds_without_current: function() {
			var refunds = this.get('debit.refunds.content');
			var self = this;
			return _.filter(refunds, function(refund) {
				return refund.get('uri') !== self.get('model.uri');
			});
		}.property('debit.refunds.@each')
    }
);
