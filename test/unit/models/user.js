module("Balanced.User");

test("has an email address", function (assert) {
    var user;
    Ember.run(function () {
        // Won't actually load until the end of the run-block.
        user = Balanced.User.find("/users/USeb4a5d6ca6ed11e2bea6026ba7db2987");
    });
    assert.equal(user.get("email_address"), "nick@rasslingcats.com");
});
