(function (Balanced) {
    'use strict';

    Balanced.BasicAdapter = DS.BasicAdapter.extend({
    });
    Balanced.BasicAdapter.ajax = function(url, type, settings) {
        settings = settings || {};
        settings.url = url;
        settings.type = type;
        settings.context = this;
        return Auth.ajax(settings);
    };
    Balanced.BasicAdapter.configure('Balanced.Account', {
      alias: 'account'
    });
    Balanced.BasicAdapter.configure('Balanced.Credit', {
      alias: 'credit'
    });
    Balanced.BasicAdapter.configure('Balanced.Debit', {
      alias: 'debit'
    });

    Balanced.Store = DS.Store.extend({
        revision: 12,
        adapter: Balanced.BasicAdapter
    });

})(window.Balanced);
