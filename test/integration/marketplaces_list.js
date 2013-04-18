module("Marketplaces List");

test("view all marketplaces", function () {
    $("a:contains('Marketplaces')").click();

    equal($("#marketplace-list").find('a').first().text(), "Test Marketplace");
});

test("view single marketplace", function () {
    $("a:contains('Marketplaces')").click();
    $("a:contains('Test Marketplace')").click();

    equal($(".marketplace-name").text(), "Test Marketplace");
});
