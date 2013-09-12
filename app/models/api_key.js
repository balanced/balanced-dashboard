Balanced.APIKey = Balanced.Model.extend({
	uri: '/v1/api_keys'
});

Balanced.TypeMappings.addTypeMapping('api_key', 'Balanced.APIKey');

Balanced.Adapter.registerHostForType(Balanced.APIKey, ENV.BALANCED.AUTH);

Balanced.APIKey.reopenClass({
	serializer: Balanced.Rev0Serializer.create()
});
