module('Marketplaces List');

test('view marketplace list', function (assert) {
    assert.equal($('#marketplaces ul').find('a').first().text(), 'Test Marketplace');
});

test('view single marketplace', function (assert) {
    //  TODO: clearly this is not a good test.
    $('#marketplaces ul a:contains("Test Marketplace")').click();
    assert.equal($('#marketplace-name').text().trim(), 'Nick\'s Test Marketplace');
});
