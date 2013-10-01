Balanced.RefundsController = Balanced.ObjectController.extend(
	Ember.Evented, {
		needs: ['marketplace'],

		refunds_without_current: function() {
			var currentModelId = this.get('id');
			var refunds = this.get('debit.refunds.content');
			return _.filter(refunds, function(refund) {
				return refund.get('id') !== currentModelId;
			});
		}.property('id', 'debit.refunds.@each')
	}
);
