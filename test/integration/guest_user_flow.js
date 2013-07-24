module('Guest', {
    setup: function () {
        Ember.run(function () {
            Balanced.Auth.setAuthProperties(false, null, null, null, false);
            Balanced.Auth.destroyGuestUser();
        });
    }, teardown: function () {

    }
});

test('visiting start creates a marketplace', function (assert) {
    Ember.run(function () {
        Balanced.Router.create().transitionTo('start');
    });
    assert.ok(window.location.hash.indexOf('start'), 'Transitioned to the start page');
    assert.equal(Balanced.Auth.get('userId'), '/users/guest', 'Userid is guest');
    assert.equal(Balanced.Auth.get('signedIn'), true, 'User is signed in');
    assert.ok(Balanced.Auth.get('isGuest'));
    assert.ok(Balanced.NET.ajaxHeaders['Authorization'], 'Authorization header set');
});

test('viewing settings page as guest, can view api secret key', function(assert) {
    Ember.run(function() {
        var guestUser = Balanced.User.create({
            marketplaces: Ember.A([
                Balanced.Marketplace.find("/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY")
            ])
        });

        Balanced.Auth.setAuthProperties(true, guestUser, '/users/guest', '73ec8c8ef40611e2a318026ba7d31e6f', true);
        Balanced.Auth.storeGuestAPIKey('73ec8c8ef40611e2a318026ba7d31e6f');

        Balanced.Router.create().transitionTo('marketplace', Balanced.Marketplace.find("/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY"));
    });

    $("li.settings a").click();

    $(".control-group .controls .api-key-secret a").click();

    var shown_api_secret_key = $(".control-group .controls .api-key-secret").text().trim();

    assert.equal(shown_api_secret_key, '73ec8c8ef40611e2a318026ba7d31e6f', 'shown api secret in settings for guest');
});

test('claim account creates a login', function (assert) {
    expect(4);

    var emailAddress = 'marshall@example.com',
        password = 'SupahSecret123~!';

    Ember.run(function () {
        Balanced.Router.create().transitionTo('start');
    });
    Ember.run(function () {
        Balanced.Router.create().transitionTo('claim');
    });

    assert.notEqual($('h1').text().trim().indexOf('Claim your account'), -1, 'title is incorrect');
    assert.equal($('[name="email_address"]').length, 1, 'email address is visible');

    $('[name="email_address"]').val(emailAddress).keyup();
    $('[name="password"]').val(password).keyup();
    $('[name="passwordConfirm"]').val(password).keyup();
    $('button', '#claim-form').click();

    var expectedCalls = [
        {
            type: Balanced.Claim,
            data: {
                email_address: emailAddress,
                password: password
            }
        },
        {
            type: Balanced.Login,
            data: {
                email_address: emailAddress,
                password: password
            }
        }
    ];

    _.each(expectedCalls, function (e) {
        var match = 0;
        _.each(Balanced.Adapter.creates, function (create) {
            if (e.type !== create.type) {
                return;
            }
            _.each(e.data, function (d) {
                if (create.data[d] !== e.data[d]) {
                    match = false;
                    return;
                }
            });
            match = true;
        });
        assert.ok(match);
    });
});
