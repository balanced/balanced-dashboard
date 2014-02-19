Balanced.computed = Ember.Namespace.create({
	sum: function(dependentKey, itemKey) {
		return Ember.computed(dependentKey, function() {
			var total = 0;
			this.get(dependentKey).forEach(function(item) {
				var number = item.get(itemKey);
				if (number) {
					total += number;
				}
			});
			return total;
		});
	},

	slice: function(dependentKey, start, end) {
		return Ember.computed(dependentKey, function() {
			var array = this.get(dependentKey) || [];
			return array.slice(start, end);
		});
	},
});
