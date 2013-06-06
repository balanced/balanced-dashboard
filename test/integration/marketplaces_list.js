module('Marketplaces List');

test('view marketplace list', function (assert) {
    assert.equal($('#marketplaces ul').find('a').first().text(), 'Nick\'s Test Marketplace');
});

test('view single marketplace', function (assert) {
    $('#marketplaces ul a:contains("Nick\'s Test Marketplace")').click();
    assert.equal($('#marketplace-name').text().trim(), 'Nick\'s Test Marketplace');
});
