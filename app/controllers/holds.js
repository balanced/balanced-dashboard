Balanced.HoldsController = Balanced.ObjectController.extend(Ember.Evented, {

	needs: ['marketplace'],

	hold_customer: function() {
		return this.get('debit.customer') || this.get('card.customer');
	}.property('debit.customer', 'card.customer')

});
