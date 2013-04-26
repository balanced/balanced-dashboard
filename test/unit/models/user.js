module("Balanced.User");

test("has an email address", function () {
    var user;
    Ember.run(function () {
        // Won't actually load until the end of the run-block.
        user = Balanced.User.find("deadbeef");
    });
    equal(user.get("email_address"), "test@balancedpayments.com");
});