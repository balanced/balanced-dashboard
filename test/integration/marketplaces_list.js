module("Marketplaces List");

test("view marketplace list", function () {
    equal($("#marketplaces ul").find('a').first().text(), "Test Marketplace");
});

test("view single marketplace", function () {
    $("#marketplaces ul a:contains('Second Test Marketplace')").click();

    equal($(".marketplace-name").text(), "Second Test Marketplace");
});
