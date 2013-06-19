Balanced.Auth = (function () {
    var defaultBalancedAuthOptions = {
        baseUrl: ENV.BALANCED.AUTH,
        signInEndPoint: '/logins',
        signOutEndPoint: '/logins/current',

        tokenKey: 'id',
        tokenIdKey: 'user_uri',
        userModel: 'Balanced.User',

        // We're using the cookie, so Ember Auth doesn't need to worry about the token
        tokenLocation: 'none',
        sessionAdapter: 'cookie',
        modules: ['authRedirectable', 'actionRedirectable', 'rememberable'],
        authRedirectable: {
            route: 'login'
        },
        actionRedirectable: {
            signInRoute: 'index',
            signInSmart: true,
            signInBlacklist: ['login'],
            signOutRoute: 'login'
        },
        rememberable: {
            tokenKey: 'uri',
            period: 1,
            autoRecall: true
        }
    };

    var auth = Ember.Auth.create(_.extend(defaultBalancedAuthOptions, window.BalancedAuthOptions));

    function loginGuestUser(apiKeySecret) {
        var guestUser = Balanced.User.create({
            marketplaces: Ember.A()
        });
        auth.set('authToken', apiKeySecret);
        auth.set('userId', '/users/guest');
        auth.set('signedIn', true);
        auth.set('isGuest', true);
        auth.set('user', guestUser);
        setAPIKey(apiKeySecret);
    }

    function setAPIKey(apiKeySecret) {
        Balanced.NET.ajaxHeaders['Authorization'] = 'Basic ' + window.btoa(apiKeySecret + ':');
    }

    function unsetAPIKey() {
        delete Balanced.NET.ajaxHeaders['Authorization'];
    }

    function loadGuestAPIKey() {
        return $.cookie(Balanced.COOKIE.API_KEY_SECRET);
    }

    function initGuestUser() {
        var apiKeySecret = loadGuestAPIKey();
        if (apiKeySecret) {
            loginGuestUser(apiKeySecret);
        }
    }

    auth.storeGuestAPIKey = function (apiKeySecret) {
        $.cookie(Balanced.COOKIE.API_KEY_SECRET, apiKeySecret);
        loginGuestUser(apiKeySecret);
    };

    auth.destroyGuestUser = function () {
        $.removeCookie(Balanced.COOKIE.API_KEY_SECRET);
        unsetAPIKey();
    };

    auth.manualLogin = function (user, login) {
        auth.destroyGuestUser();
        //  persist cookie for next time
        $.cookie(Balanced.COOKIE.EMBER_AUTH_TOKEN, login.uri);
        auth.set('authToken', login.uri);
        auth.set('userId', user.uri);
        auth.set('signedIn', true);
        auth.set('user', user);
        auth.set('isGuest', false);
    };

    auth.setAPIKey = setAPIKey;
    auth.unsetAPIKey = unsetAPIKey;

    initGuestUser();

    return auth;
}());
