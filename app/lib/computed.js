var get = Ember.get;

Balanced.computed = Ember.Namespace.create({
	sum: function(dependentKey, itemKey) {
		return Ember.computed(dependentKey, function() {
			var total = 0;
			get(this, dependentKey).forEach(function(item) {
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
			var array = get(this, dependentKey) || [];
			return array.slice(start, end);
		});
	},

	concat: function(dependentKey, key) {
		return Ember.computed(dependentKey, function() {
			var value = get(this, dependentKey) || '';
			return value + key;
		});
	}
});
