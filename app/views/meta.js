Balanced.MetaView = Ember.View.extend({
	templateName: "components/meta",
	meta_array: function() {
		var meta = this.get('type.meta');
		console.log(meta)
		if (!meta) {
			return meta;
		}

		return _.map(meta, function(val, key) {
			return {
				key: key,
				value: val
			};
		}) || [];
	}.property('type.meta')

});

