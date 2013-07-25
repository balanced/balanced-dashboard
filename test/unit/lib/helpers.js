module('Balanced.Utils');

test('getParamByName', function (assert) {
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

test('formatCurrency', function (assert) {
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
        '$-9,845,263.72',
        '$-100.00',
        '$-1.05',
        '$-0.01',
        '$0.00',
        '$0.01',
        '$1.05',
        '$100.00',
        '$9,847,263.72',
        null
    ];

    for (var i = 0; i < cents.length; i++) {
        assert.equal(Balanced.Utils.formatCurrency(cents[i]), expected[i]);
    }
});

test('dollarsToCents', function (assert) {
    var dollars = [
        '0',
        '0.',
        '0.1',
        '.51',
        '0.01',
        '1.05',
        '45.98',
        '100',
        '100.0',
        '100.00',
        '631.55',
        '1498',
        ' 1,498 ',
        ' 1,498. ',
        ' 1,498.1 ',
        '2947.56',
        '2,947.56',
        '9847263.72',
        '9847263',
        '9,847,263.72',
        '223.',
        '223.6',
        '2,947.',
        '2,947.5'
    ];

    var cents = [
        0,
        0,
        10,
        51,
        1,
        105,
        4598,
        10000,
        10000,
        10000,
        63155,
        149800,
        149800,
        149800,
        149810,
        294756,
        294756,
        984726372,
        984726300,
        984726372,
        22300,
        22360,
        294700,
        294750
    ];

    for (var i = 0; i < dollars.length; i++) {
        assert.equal(Balanced.Utils.dollarsToCents(dollars[i]), cents[i]);
    }

    var invalid = [
        null,
        undefined,
        '',
        'dsfadsf',
        '!safds',
        '$afs',
        '122.34324'
    ];

    ////
    // Not a fan of this, but we need to wrap in a functions outside of the
    // loop so jshint is happy.
    ////
    function isInvalid(val) {
        assert.throws(function () {
                Balanced.Utils.dollarsToCents(val);
            },
            /is not a valid dollar amount/,
            'Expected an error to be thrown'
        );
    }

    for (var j = 0; j < invalid.length; j++) {
        isInvalid(invalid[j]);
    }
});

test('isValidPassword', function (assert) {
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

test('toTitleCase', function(assert) {
    var inputs = [
        null,
        undefined,
        '',
        'a',
        'something',
        'something else',
        'something_else'
    ];

    var outputs = [
        null,
        undefined,
        '',
        'A',
        'Something',
        'Something Else',
        'Something Else'
    ];

    for (var i = 0; i < inputs.length; i++) {
        assert.equal(Balanced.Utils.toTitleCase(inputs[i]), outputs[i]);
    }
});