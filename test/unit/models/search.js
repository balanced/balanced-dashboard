module('Balanced.Search', {

});

test('search query generation', function (assert) {
	var expected = '/v1/marketplaces/MP123/search/search?limit=10&offset=0&q=hodor';
	var params = {
		query: 'hodor'
	};
	var uri = Balanced.SearchQuery.createUri('/v1/marketplaces/MP123/search', params);
	assert.equal(uri, expected);

	params.offset = 20;
	uri = Balanced.SearchQuery.createUri('/v1/marketplaces/MP123/search', params);
	assert.notEqual(uri, expected);
});
