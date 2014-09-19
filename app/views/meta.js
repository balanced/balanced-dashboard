import Ember from "ember";

var MetaView = Ember.View.extend({
	meta_array: function() {
		var meta = this.get('type.meta');
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

export default MetaView;
