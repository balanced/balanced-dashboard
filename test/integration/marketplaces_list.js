module("Marketplaces List");

test("view marketplace list", function () {
    equal($("#marketplaces ul").find('a').first().text(), "Test Marketplace");
});

test("view single marketplace", function () {
    Testing.selectMarketplaceByName();
    equal($("#marketplace-name").text().trim(), "Test Marketplace");
});
