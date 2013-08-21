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
    Ember.run(function () {
        Balanced.Router.create().transitionTo('login');
    });

    $("form#auth-form a").first().click();
    assert.equal($("form#forgot-form").length, 1, 'The forgot form exists.');
});

asyncTest('forgot password form submits', function (assert) {
    expect(3);

    var spy = sinon.spy(Balanced.Adapter, "create");

    Ember.run(function () {
        Balanced.Router.create().transitionTo('forgotPassword');
    });

    Testing.execWithTimeoutPromise(function() {
        $("form#forgot-form input[name=email_address]").val('foo@bar.com').trigger('keyup');

        $("form#forgot-form button").click();
    })().then(Testing.execWithTimeoutPromise(function() {
        assert.equal($("div#content div.alert-black").length, 1, 'The black confirmation box is visible');

        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.ForgotPassword, '/password', {
            email_address: 'foo@bar.com'
        }));
        start();
    }));
});
