// Use Ember.get because this.get might be over-ridden for custom objects
var get = Ember.get,
	a_slice  = Array.prototype.slice;

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
	},

	fmt: function() {
		var formatString = '' + a_slice.call(arguments, -1),
			properties   = a_slice.call(arguments, 0, -1);

		computed = Ember.computed(function() {
			var values = [], value;
			for (var i = 0, l = properties.length; i < l; ++i) {
				value = get(this, properties[i]);
				values.push(value || '');
			}

			return Ember.String.fmt(formatString, values);
		});

		return computed.property.apply(computed, properties);
	}
});
