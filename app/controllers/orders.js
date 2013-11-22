Balanced.OrdersController = Balanced.ObjectController.extend(Ember.Evented, {

	needs: ['marketplace'],

	amounts: function() {
		var self = this;
		var amounts = {};
		var types = ['debits', 'refunds', 'credits', 'reversals'];

		_.each(types, function(type) {
			amounts[type] = {
				quantity: 0,
				total: 0
			};
			var things = self.get(type) || Ember.A();
			things.forEach(function(thing) {
				amounts[type].quantity++;
				amounts[type].total += thing.get('amount');
			});
			amounts[type].total = Balanced.Utils.formatCurrency(amounts[type].total);
		});
		return Ember.Object.create(amounts);
	}.property('debits.@each', 'refunds.@each', 'credits.@each', 'reversals.@each'),

	multiple_credits: function() {
		return this.get('credits.length') > 1;
	}.property('credits.@each')

});
