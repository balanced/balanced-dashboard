module("Balanced.Marketplace");

test("has a name", function () {
    var marketplace;
    Ember.run(function () {
        // Won't actually load until the end of the run-block.
        marketplace = Balanced.Marketplace.find("TEST-MP1");
    });
    equal(marketplace.get("name"), "Test Marketplace");
});