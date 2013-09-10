Balanced.AjaxAdapter = Balanced.BaseAdapter.extend({
    initAdapter: function () {
        this.hostsByType = {};
    },

    _uri: function (type, uri) {
        this._checkParams(type, uri);

        var host = this.getHostForType(type);
        if (uri && uri.indexOf(host) !== 0 && uri.indexOf('https') !== 0) {
            uri = host + uri;
        }
        return uri;
    },

    get: function (type, uri, success, error) {
        var settings = {};
        settings.error = error;
        this.ajax(this._uri(type, uri), 'GET', settings).then(function (json) {
            success(json);
        });
    },

    create: function (type, uri, data, success, error) {
        var settings = {};
        settings.data = data;
        settings.error = error;
        this.ajax(this._uri(type, uri), 'POST', settings).then(function (json) {
            success(json);
        });
    },

    update: function (type, uri, data, success, error) {
        var settings = {};
        settings.data = data;
        settings.error = error;
        this.ajax(this._uri(type, uri), 'PUT', settings).then(function (json) {
            success(json);
        });
    },

    delete: function (type, uri, success, error) {
        var settings = {};
        settings.error = error;
        this.ajax(this._uri(type, uri), 'DELETE', settings).then(function (json) {
            success(json);
        });
    },

    ajax: function (url, type, settings) {
        settings = settings || {};
        // HACK this goes away when we have oAuth
        settings.url = this._appendMarketplaceAuthParam(url);
        settings.type = type;
        settings.context = this;
        settings.xhrFields = {
            withCredentials: true
        };
        return Balanced.NET.ajax(settings);
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

    _appendMarketplaceAuthParam: function (uri) {
        if (uri && uri.indexOf('/users/') === -1 && !( /\/v.+\/marketplaces\/.+/.test(uri) ) &&
            Balanced.currentMarketplace) {
            uri = Balanced.Utils.updateQueryStringParameter(uri, 'marketplace', Balanced.currentMarketplace.get('id'));
        }
        return uri;
    }
});
