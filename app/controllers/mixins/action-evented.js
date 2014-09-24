import Ember from 'ember';

var ActionEvented = function() {
	var arr = _.toArray(arguments);

	var obj = {};

	_.each(arr, function(val, key) {
		obj[val] = function() {
			var args = _.toArray(arguments);
			args.unshift(val);
			return this.trigger.apply(this, args);
		};
	});

	return Ember.Mixin.create(Ember.Evented, {
		actions: obj
	});
};

export default ActionEvented;
