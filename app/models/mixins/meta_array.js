Balanced.MetaArrayMixin = Ember.Mixin.create({
	meta_array: function() {
		var meta = this.get('meta');
		if (!meta) {
			return meta;
		}

		var metaArray = [];

		for (var key in meta) {
			metaArray.push({
				key: key,
				value: meta[key]
			});
		}
		return metaArray;
	}.property('meta')
});
