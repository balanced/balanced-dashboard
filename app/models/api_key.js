Balanced.APIKey = Balanced.Model.extend({
	uri: '/v1/api_keys'
});

Balanced.TypeMappings.addTypeMapping('api_key', 'Balanced.APIKey');
