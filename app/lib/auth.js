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

    auth.setAuthProperties = function (signedIn, user, userId, authToken, isGuest) {
        auth.set('_strategy.adapter.authToken', authToken);
        auth.set('_session.userId', userId);
        auth.set('_session.signedIn', signedIn);
        auth.set('_session.user', user);
        auth.set('isGuest', isGuest);
    };

    function loginGuestUser(apiKeySecret) {
        var guestUser = Balanced.User.create({
            marketplaces: Ember.A()
        });
        auth.setAuthProperties(true, guestUser, '/users/guest', apiKeySecret, true);
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
        $.removeCookie(Balanced.COOKIE.SESSION);
        Balanced.NET.loadCSRFToken();
        unsetAPIKey();
    };

    auth.manualLogin = function (user, login) {
        auth.destroyGuestUser();
        //  persist cookie for next time
        $.cookie(Balanced.COOKIE.EMBER_AUTH_TOKEN, login.uri);
        auth.setAuthProperties(true, user, user.uri, login.uri, false);
    };

    auth.setAPIKey = setAPIKey;
    auth.unsetAPIKey = unsetAPIKey;

    initGuestUser();

    // Since we can't use withCredentials for signIn (due to Firefox problems
    // with async==true), grab the session cookie out of the response and set
    // it manually upon login
    auth.on('signInSuccess', function () {
        var response = Balanced.Auth.get('jqxhr');
        var sessionCookieValue = response.session;
        $.cookie(Balanced.COOKIE.SESSION, sessionCookieValue, {
            expires: 14,
            path: '/',
            domain: 'balancedpayments.com'
        });
    });

    return auth;
}());
