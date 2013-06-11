module('Marketplaces.Index', {
    setup: function () {
    }
});

test('view a marketplace sets the mru cookie', function (assert) {
    Testing.selectMarketplaceByName();
    assert.equal(
        $.cookie(Balanced.COOKIE.MARKETPLACE_URI),
        '/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY',
        'mru cookie is set'
    );
});

test('view marketplace list', function (assert) {
    assert.equal($('#marketplaces ul').find('a').first().text(), 'Nick\'s Test Marketplace');
});

test('view single marketplace', function (assert) {
    $('#marketplaces ul a:contains("Nick\'s Test Marketplace")').click();
    assert.equal($('#marketplace-name').text().trim(), 'Nick\'s Test Marketplace');
});
