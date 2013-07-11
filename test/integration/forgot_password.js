module('ForgotPassword', {
    setup: function () {
        Ember.run(function () {
            Balanced.Auth.setAuthProperties(false, null, null, null, false);
        });
    }, teardown: function () {

    }
});

test('clicking forgot password from login takes you to the page', function (assert) {
    Ember.run(function () {
        Balanced.Router.create().transitionTo('login');
    });

    $("form#auth-form a").first().click();
    assert.equal($("form#forgot-form").length, 1, 'The forgot form exists.');
});

test('forgot password form submits', function (assert) {
    Ember.run(function () {
        Balanced.Router.create().transitionTo('forgotPassword');
    });

    $("form#forgot-form input[name=email_address]").val('foo@bar.com').trigger('keyup');

    $("form#forgot-form button").click();

    assert.equal($("div#content div.alert-black").length, 1, 'The black confirmation box is visible');
});