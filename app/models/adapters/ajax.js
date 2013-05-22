Balanced.AjaxAdapter = Balanced.BaseAdapter.extend({
    initAdapter: function () {
        this.hostsByType = {};
    },

    get: function (type, uri, success) {
        var host = this.getHostForType(type);
        this.ajax(host + uri, 'GET').then(function (json) {
            success(json);
        });
    },

    create: function (type, uri, data, success, error) {
        var settings = {};
        settings.data = data;
        settings.error = error;
        var host = this.getHostForType(type);
        this.ajax(host + uri, 'POST', settings).then(function (json) {
            success(json);
        });
    },

    update: function (type, uri, data, success, error) {
        var settings = {};
        settings.data = data;
        settings.error = error;
        var host = this.getHostForType(type);
        this.ajax(host + uri, 'PUT', settings).then(function (json) {
            success(json);
        });
    },

    delete: function (type, uri, success, error) {
        var settings = {};
        settings.error = error;
        var host = this.getHostForType(type);
        this.ajax(host + uri, 'DELETE', settings).then(function (json) {
            success(json);
        });
    },

    ajax: function (url, type, settings) {
        settings = settings || {};
        // HACK this goes away when we have oAuth
        settings.url = this._appendMarketplaceAuthParam(url);
        settings.type = type;
        settings.context = this;
        return Balanced.Auth.send(settings);
    },

    registerHostForType: function (type, host) {
        this.hostsByType[type] = host;
    },

    getHostForType: function (type) {
        var host = ENV.BALANCED.API;
        if (this.hostsByType[type]) {
            host = this.hostsByType[type];
        }
        return host;
    },

    _appendMarketplaceAuthParam: function(uri) {
        if(uri.indexOf('/users/') === -1 
            && !( /\/v.+\/marketplaces\/.+/.test(uri) )
            && Balanced.currentMarketplace) {

            var authedUri = Balanced.Utils.updateQueryStringParameter(uri, "marketplace", Balanced.currentMarketplace.get('id'));

            return authedUri;
        } else {
            return uri;
        }
    }
});
