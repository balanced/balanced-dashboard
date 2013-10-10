Balanced.APIKey = Balanced.Model.extend({
	uri: '/api_keys'
});

Balanced.TypeMappings.addTypeMapping('api_key', 'Balanced.APIKey');
