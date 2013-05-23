module("Marketplaces List");

test("view marketplace list", function (assert) {
    assert.equal($("#marketplaces ul").find('a').first().text(), "Test Marketplace");
});

test("view single marketplace", function (assert) {
    Testing.selectMarketplaceByName();
    assert.equal($("#marketplace-name").text().trim(), "Test Marketplace");
});
