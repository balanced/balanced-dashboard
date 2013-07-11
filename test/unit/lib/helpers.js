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

test("formatCurrency", function (assert) {
    var cents = [
        -984526372,
        -10000,
        -105,
        -1,
        0,
        1,
        105,
        10000,
        984726372,
        null
    ];

    var expected = [
        "$-9,845,263.72",
        "$-100.00",
        "$-1.05",
        "$-0.01",
        "$0.00",
        "$0.01",
        "$1.05",
        "$100.00",
        "$9,847,263.72",
        null
    ];

    for (var i = 0; i < cents.length; i++) {
        assert.equal(Balanced.Utils.formatCurrency(cents[i]), expected[i]);
    }
});

test("isValidPassword", function (assert) {
    var invalid_passwords = [
        null,
        '',
        '1',
        '123456',
        'a',
        'abcdef'
    ];

    var valid_passwords = [
        '1abcdef',
        '12345f',
        'SupahSecret123',
        'JohnSe!@#~~~cret1212',
        'IAMSUPERMAN123'
    ];

    _.each(invalid_passwords, function (password) {
        assert.equal(Balanced.PASSWORD.REGEX.test(password), false, password);
    });

    _.each(valid_passwords, function (password) {
        assert.equal(Balanced.PASSWORD.REGEX.test(password), true, password);
    });
});
