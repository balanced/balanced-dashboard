module('ForgotPassword', {
    setup: function () {
        Ember.run(function () {
            Balanced.Auth.setAuthProperties(false, null, null, null, false);
        });
        Balanced.Adapter.asyncCallbacks = true;
    },
    teardown: function () {
    }
});

test('clicking forgot password from login takes you to the page', function (assert) {
    visit('/login').then(function() {
        return click($("form#auth-form a").first());
    }).then(function() {
        assert.equal($("form#forgot-form").length, 1, 'The forgot form exists.');
    });
});

test('forgot password form submits', function (assert) {
    var spy = sinon.spy(Balanced.Adapter, "create");

    visit('/forgot_password').then(function() {
        $("form#forgot-form input[name=email_address]").val('foo@bar.com').trigger('keyup');

        return click("form#forgot-form button");
    }).then(function() {
        assert.equal($("div#content div.alert-black").length, 1, 'The black confirmation box is visible');

        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.ForgotPassword, '/password', {
            email_address: 'foo@bar.com'
        }));
    });
});
