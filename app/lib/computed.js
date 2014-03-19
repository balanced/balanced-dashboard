// Use Ember.get because this.get might be over-ridden for custom objects
var get = Ember.get,
	a_slice  = Array.prototype.slice;

Balanced.computed = Ember.Namespace.create({
	sum: function(dependentKey, itemKey) {
		// FIXME - should be wrapped in Ember.arrayComputed?
		return Ember.computed(function() {
			var total = 0,
				arr = get(this, dependentKey) || [];

			arr.forEach(function(item) {
				var number = get(item, itemKey);

				if (number) {
					total += number;
				}
			});

			return total;
		}).property(dependentKey, dependentKey + '.length', dependentKey + '.@each.' + itemKey);
	},

	slice: function(dependentKey, start, end) {
		return Ember.computed(dependentKey, function() {
			var array = get(this, dependentKey) || [];
			// array might be an Ember.ArrayProxy object so use native slice method here
			return array.slice(start, end);
		});
	},

	concat: function(dependentKey, key, flip) {
		return Ember.computed(dependentKey, function() {
			var value = get(this, dependentKey) || '';

			if (flip) {
				return key + value;
			}

			return value + key;
		});
	},

	fmt: function() {
		var formatString = '' + a_slice.call(arguments, -1),
			properties   = a_slice.call(arguments, 0, -1);

		computed = Ember.computed(function() {
			var values = [];

			for (var i = 0, l = properties.length; i < l; ++i) {
				values.push(get(this, properties[i]) || '');
			}

			return Ember.String.fmt(formatString, values);
		});

		return computed.property.apply(computed, properties);
	}
});
