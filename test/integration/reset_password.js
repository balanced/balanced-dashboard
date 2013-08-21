module('ResetPassword', {
    setup: function () {
        Ember.run(function () {
            Balanced.Auth.setAuthProperties(false, null, null, null, false);
        });
        Balanced.Adapter.asyncCallbacks = true;
    },
    teardown: function () {
    }
});

test('reset password page exists', function (assert) {
    Ember.run(function () {
        Balanced.Router.create().transitionTo('resetPassword', 'abcdefghijklmnopq');
    });

    assert.equal($("form#reset-password-form").length, 1, 'The reset password form exists.');
});

test('setting a weak password should error', function (assert) {
    Ember.run(function () {
        Balanced.Router.create().transitionTo('resetPassword', 'abcdefghijklmnopq');
    });

    $("form#reset-password-form input[name=password]").val('123456').trigger('keyup');
    $("form#reset-password-form input[name=password_confirm]").val('123456').trigger('keyup');

    $("form#reset-password-form button").click();
    assert.equal($("form#reset-password-form").hasClass('error'), true, 'reset password form should have error class');
});

asyncTest('reset password form submits', function (assert) {
    expect(3);

    var spy = sinon.spy(Balanced.Adapter, "update");

    Ember.run(function () {
        Balanced.Router.create().transitionTo('resetPassword', 'abcdefghijklmnopq');
    });

    Testing.execWithTimeoutPromise(function() {
        $("form#reset-password-form input[name=password]").val('abcdef5').trigger('keyup');
        $("form#reset-password-form input[name=password_confirm]").val('abcdef5').trigger('keyup');

        $("form#reset-password-form button").click();
    })().then(Testing.execWithTimeoutPromise(function() {
        assert.equal($("div#content div.alert-black").length, 1, 'The black confirmation box is visible');

        assert.ok(spy.calledOnce);
        assert.ok(spy.calledWith(Balanced.ResetPassword, '/password/abcdefghijklmnopq', {
            password: 'abcdef5',
            password_confirm: 'abcdef5',
            token: 'abcdefghijklmnopq'
        }));
        start();
    }));
});
