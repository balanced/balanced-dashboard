module("Marketplaces List");

test("view marketplace list", function () {
    equal($("#marketplaces ul").find('a').first().text(), "Test Marketplace");
});

test("view single marketplace", function () {
    $("#marketplaces ul a:contains('Test Marketplace')").click();
    equal($("#marketplace-name").text().trim(), "Nick's Test Marketplace");
});
