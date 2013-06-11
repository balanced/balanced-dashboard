Balanced.COOKIE = {
    MARKETPLACE_URI: 'marketplaceUri',
    API_KEY_SECRET: 'apiKeySecret',
    EMBER_AUTH_TOKEN: 'ember-auth-rememberable',
    CSRF_TOKEN: 'csrftoken',
    set: function (name, value) {
        $.cookie(name, value);
    }
};

Balanced.KEYS = {
    ESCAPE: 27
};

