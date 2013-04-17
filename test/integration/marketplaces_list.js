module("Marketplaces List");

test("view all marketplaces", function () {
    $("a:contains('Marketplaces')").click();

    equal($("#marketplace-list").find('a').first().text(), "Test Marketplace");
});
