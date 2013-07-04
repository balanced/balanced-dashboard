Balanced.COOKIE = {
    MARKETPLACE_URI: 'mru',
    API_KEY_SECRET: 'apiKeySecret',
    EMBER_AUTH_TOKEN: 'ember-auth-rememberable',
    CSRF_TOKEN: 'csrftoken',
    SESSION: 'session',
    set: function (name, value, options) {
        $.cookie(name, value, options);
    }
};

Balanced.TIME = {
    THREE_YEARS: 365 * 3
};

Balanced.KEYS = {
    ENTER: 13,
    ESCAPE: 27
};

Balanced.BANK_ACCOUNT_TYPES = [
    {
        label: 'Checking',
        value: 'checking'
    },
    {
        label: 'Savings',
        value: 'savings'
    }
];
