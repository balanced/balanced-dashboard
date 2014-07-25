Balanced.Download = Balanced.Model.extend({
	// have to override the URI for create, since the uri property of the JSON is the search URI
	_createUri: function() {
		return '/downloads';
	},

	uri: ""
});

Balanced.Adapter.registerHostForType(Balanced.Download, ENV.BALANCED.WWW);

Balanced.Download.reopenClass({
	serializer: Balanced.Rev0Serializer.extend({
		_propertiesMap: function(record) {
			return record.getProperties(
				"uri",
				"email_address",
				"beginning",
				"ending",
				"type"
			);
		}
	}).create()
});
