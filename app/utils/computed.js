import Ember from "ember";
// Use Ember.get because this.get might be over-ridden for custom objects
var get = Ember.get,
a_slice = Array.prototype.slice;

var Computed = Ember.Namespace.create({
	sum: function(dependentKey, itemKey) {
		// FIXME - should be wrapped in Ember.arrayComputed?
		return Ember.computed(function() {
			var total = 0,
				arr = get(this, dependentKey) || [];

			if (!arr || !arr.forEach) {
				return 0;
			}

			arr.forEach(function(item) {
				var number = get(item, itemKey);

				if (number) {
					total += number;
				}
			});

			return total;
		}).property(dependentKey, dependentKey + '.length', dependentKey + '.@each.' + itemKey);
	},

	sumAll: function() {
		var args = a_slice.call(arguments);

		var computed = Ember.computed(function() {
			var total = 0;

			for (var i = 0, l = args.length; i < l; ++i) {
				total += (get(this, args[i]) || 0);
			}

			return total;
		});

		return computed.property.apply(computed, args);
	},

	subtract: function(key1, key2) {
		return Ember.computed(function() {
			return this.get(key1) - this.get(key2);
		}).property(key1, key2);
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

	downcase: function(dependentKey) {
		return Ember.computed(dependentKey, function() {
			return (get(this, dependentKey) || "").toLowerCase();
		});
	},

	fmt: function() {
		var formatString = '' + a_slice.call(arguments, -1),
			properties = a_slice.call(arguments, 0, -1);

		var computed = Ember.computed(function() {
			var values = [];

			for (var i = 0, l = properties.length; i < l; ++i) {
				values.push(get(this, properties[i]) || '');
			}

			return Ember.String.fmt(formatString, values);
		});

		return computed.property.apply(computed, properties);
	},

	orProperties: function() {
		var args = a_slice.call(arguments);

		var computed = Ember.computed(function() {
			var result;

			for (var i = 0, l = args.length; i < l; ++i) {
				result = result || get(this, args[i]);

				if (result) {
					return result;
				}
			}

			return result;
		});

		return computed.property.apply(computed, args);
	},

	ifThisOrThat: function(dependentKey, one, two, invert) {
		return Ember.computed(dependentKey, function() {
			var check = get(this, dependentKey);

			if (invert) {
				check = !check;
			}

			return check ? one : two;
		});
	},

	transform: function(dependentKey, func, self) {
		return Ember.computed(dependentKey, function() {
			if (_.isString(func)) {
				func = get(self || this, func) || get(this.constructor, func);
			}

			return func.call(self || this, get(self || this, dependentKey));
		});
	}
});

export default Computed;
