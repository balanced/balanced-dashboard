Balanced.MetaArrayMixin = Ember.Mixin.create({
	meta_array: function() {
		var meta = this.get('meta');
		if (!meta) {
			return meta;
		}

		return _.map(meta, function(val, key) {
			return {
				key: key,
				value: val
			};
		}) || [];
	}.property('meta')
});
