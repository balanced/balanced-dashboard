module('Guest', {
    setup: function () {
        Ember.run(function () {
            Balanced.Auth.set('authToken', null);
            Balanced.Auth.set('userId', null);
            Balanced.Auth.set('signedIn', false);
            Balanced.Auth.set('user', null);
        });
    }, teardown: function () {

    }
});

test('visiting start creates a marketplace', function (assert) {
    Ember.run(function () {
        Balanced.Router.create().transitionTo('start');
    });
    assert.ok(window.location.hash.indexOf('start'), 'Transitioned to the start page');
    assert.equal(Balanced.Auth.get('authToken'), '/users/guest', 'Auth token is guest');
    assert.equal(Balanced.Auth.get('userId'), '/users/guest', 'Userid is guest');
    assert.equal(Balanced.Auth.get('signedIn'), true, 'User is signed in');
    assert.ok(Balanced.Auth.get('isGuest'));
    assert.ok(Balanced.NET.ajaxHeaders['Authorization'], 'Authorization header set');
});
