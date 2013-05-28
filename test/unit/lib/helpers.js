module("Balanced.Utils");

test("getParamByName", function (assert) {
    var uris = [
        '/v1/marketplaces?query=123',
        '/v1/marketplaces?query=123&after=bar',
        '/v1/marketplaces?infront=foo&query=123&after=bar'
    ];

    for (var i = 0; i < uris.length; i++) {
        var result = Balanced.Utils.getParamByName(uris[i], 'query');
        assert.equal(result, '123');
    }
});
