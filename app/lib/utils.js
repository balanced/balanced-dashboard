Balanced.Utils = {
    stripDomain: function (url) {
        return url.replace(/^.*\/\/[^\/]+/, '');
    },

    prettyLogUrl: function (url) {
        return Balanced.Utils.stripDomain(url).replace(/\/marketplaces\/[^\/]*\/(.+)$/, '/.../$1').split("?")[0];
    },

    prettyPrint: function (obj) {
        return JSON.stringify(obj, null, 2);
    },

    geoIP: function (ip, callback) {
        if(window.TESTING) {
            callback("(San Francisco, California, United States)");
            return;
        }

        if (ip) {
            $.ajax('https://freegeoip.net/json/' + ip, {
                dataType: 'jsonp',
                type: 'GET',
                jsonp: 'callback'
            }).then(function (result) {
                var geoIpString;

                if (result.city && result.region_name && result.country_name) {
                    geoIpString = '(' + result.city + ', ' + result.region_name + ', ' + result.country_name + ')';
                }
                else if (result.region_name && result.country_name) {
                    geoIpString = '(' + result.region_name + ', ' + result.country_name + ')';
                }

                if (callback && typeof(callback) === "function") {
                    callback(geoIpString);
                } else {
                    return geoIpString;
                }
            });
        }
    },

    toTitleCase: function (str) {
        if (!str) {
            return str;
        }
        return str.replace(/_/g, ' ').replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },

    getParamByName: function (uri, name) {
        name = name.replace(/[\[]/, "\\\\[").replace(/[\]]/, "\\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(uri);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    /*
     * Inserts or updates a single query string parameter
     */
    updateQueryStringParameter: function (uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf("?") > -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, "$1" + key + "=" + value + "$2");
        }
        else {
            return uri + separator + key + "=" + value;
        }
    },

    sortDict: function (dict) {
        var sorted = [];
        for (var key in dict) {
            sorted[sorted.length] = key;
        }
        sorted.sort();

        var tempDict = {};
        for (var i = 0; i < sorted.length; i++) {
            tempDict[sorted[i]] = dict[sorted[i]];
        }

        return tempDict;
    },

    formatCurrency: function (cents) {
        var prepend = '$';
        if(cents < 0) {
            cents = cents * -1;
            prepend = '-$';
        }
        if (cents !== null) {
            return prepend + (cents / 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
    },

    formatNumber: function (number){
        if (number !== null && number !== undefined) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return number;
    },

    capitalize: function (str) {
        if (!str) {
            return str;
        }

        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    dollarsToCents: function (dollars) {
        if (!dollars) {
            throw new Error('%@ is not a valid dollar amount'.fmt(dollars));
        }

        // remove commas and whitespace
        dollars = dollars.replace(/,|\s/g, '');

        // make sure our input looks reasonable now, or else fail
        if (!/^([0-9]*(\.[0-9]{0,2})?)$/.test(dollars)) {
            throw new Error('%@ is not a valid dollar amount'.fmt(dollars));
        }

        return Math.round(100 * parseFloat(dollars));
    },

    toGravatar: function (emailHash) {
        return emailHash ? 'https://secure.gravatar.com/avatar/%@?s=30&d=mm'.fmt(emailHash) : 'https://secure.gravatar.com/avatar?s=30&d=mm';
    },

    setCurrentMarketplace: function (marketplace) {
        // Store the marketplace in a global so we can use it for auth.
        // TODO: TAKE THIS OUT when we've moved to oAuth
        Balanced.currentMarketplace = marketplace;
        if (marketplace) {
            $.cookie(Balanced.COOKIE.MARKETPLACE_URI, marketplace.get('uri'), {
                path: '/',
                expires: Balanced.TIME.THREE_YEARS
            });
        }
    },

    applyUriFilters: function (uri, params) {
        if (!uri) {
            return uri;
        }

        var transformedParams = ['limit', 'offset', 'sortField', 'sortOrder', 'minDate', 'maxDate', 'type', 'query'];

        var filteringParams = {
            limit: params.limit || 10,
            offset: params.offset || 0
        };

        if (params.sortField && params.sortOrder && params.sortOrder !== 'none') {
            filteringParams.sort = params.sortField + ',' + params.sortOrder;
        }

        if (params.minDate) {
            filteringParams['created_at[>]'] = params.minDate.toISOString();
        }
        if (params.maxDate) {
            filteringParams['created_at[<]'] = params.maxDate.toISOString();
        }
        if (params.type) {
            switch (params.type) {
                case 'transaction':
                    filteringParams['type[in]'] = 'credit,debit,refund,hold';
                    break;
                case 'funding_instrument':
                    filteringParams['type[in]'] = 'bank_account,card';
                    break;
                default:
                    filteringParams.type = params.type;
            }
        }
        filteringParams.q = '';
        if (params.query && params.query !== '%') {
            filteringParams.q = params.query;
        }

        filteringParams = _.extend(filteringParams, _.omit(params, transformedParams));

        filteringParams = Balanced.Utils.sortDict(filteringParams);

        var queryString = $.map(filteringParams,function (v, k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(v);
        }).join('&');

        uri += '?' + queryString;

        return uri;
    },

    /*
     * This function checks whether data is loaded, when it is loaded, loadedFunc
     * is called and the result is returned. Otherwise, result of loadingFunc()
     * will be returned and callback(loadedFunc()) will be called once the data is loaded
     *
     * It is very useful for getting a loading message when it is loading,
     * update the information later with the data is loaded.
     */
    maybeDeferredLoading: function (data, callback, loadingFunc, loadedFunc) {
        // the data is already loaded
        if (data.isLoaded) {
            return loadedFunc();
        }

        // called when data is loaded
        data.on('didLoad', function () {
            callback(loadedFunc());
        });
        return loadingFunc();
    },

    /*
     * This function does almost the same as linkTo does. Except it determines
     * which route to go by type of given model object. As we may have different
     * types of model appears in the same table, this function is pretty useful
     * for generating a link to any data entity we had.
     *
     * To use it, for example, simply put
     *
     *     {{#linkToEntity account}}Account link{{/linkToEntity}}
     *
     * in the handlebears template.
     */
    linkToEntity: function (property) {
        var options = [].slice.call(arguments, -1)[0];
        var params = [].slice.call(arguments, 1, -1);

        /*
         * This basically evalute the property from name to object in the template context
         * borrowed from https://github.com/emberjs/ember.js/blob/v1.0.0-rc.6.1/packages/ember-handlebars/lib/helpers/debug.js
         */
        var context = (options.contexts && options.contexts[0]) || this,
            normalized = Ember.Handlebars.normalizePath(context, property, options.data),
            pathRoot = normalized.root,
            path = normalized.path,
            obj = (path === 'this') ? pathRoot : Ember.Handlebars.get(pathRoot, path, options);

        if(!obj) {
            return obj;
        }

        var route_name;
        var link_view = Ember.LinkView;
        switch (obj.constructor) {
            case Balanced.Account:
                /*
                 * By passing account object to linkTo or LinkView, when a user click on it, the data of
                 * account is displayed. The account object is deprecated, we want to display customer
                 * object instead.

                 * We can get a corresponding customer object from the server, but that is a deferred
                 * operation, we cannot do it in this handlebear helper function. To solve that problem,
                 * I want to change the behavior of LinkView. When a user click on it, it will load
                 * the corresponding customer object and transition to the customer route with it.
                 *
                 * Maybe there is a better solution, but this is the best workaround I can see. When
                 * we get rid of the deprecated account object, we can also get rid of this hack.
                 */
                route_name = 'customers';
                link_view = Balanced.AccountLinkView;
                break;
            case Balanced.Customer:
                route_name = 'customers';
                break;
            case Balanced.BankAccount:
                route_name = 'bank_accounts';
                break;
            case Balanced.Card:
                route_name = 'cards';
                break;
            case Balanced.Credit:
                route_name = 'credits';
                break;
            case Balanced.Debit:
                route_name = 'debits';
                break;
            case Balanced.Hold:
                route_name = 'holds';
                break;
            case Balanced.Refund:
                route_name = 'refunds';
                break;
            case Balanced.Reversal:
                route_name = 'reversals';
                break;
            case Balanced.Log:
                route_name = 'logs.log';
                break;
            case Ember.Deferred:
                return;
            default:
                throw new Ember.Error('not supported model %@'.fmt(obj));
        }

        var hash = options.hash;

        hash.namedRoute = route_name;
        hash.currentWhen = hash.currentWhen || route_name;
        hash.disabledBinding = hash.disabledWhen;

        hash.parameters = {
            context: this,
            options: options,
            params: [obj].concat(params)
        };
        return Ember.Handlebars.helpers.view.call(this, link_view, options);
    },

    combineUri: function(baseUri, path) {
        if(!baseUri || !path) {
            throw new Error("Can't combine URIs: %@ %@".fmt(baseUri, path));
        }

        // strip trailing slash
        if(baseUri[baseUri.length-1] === '/') {
            baseUri = baseUri.substring(0, baseUri.length-1);
        }

        // strip leading slash
        if(path[0] === '/') {
            path = path.substring(1);
        }

        return baseUri + '/' + path;
    },

    date_formats: {
        short: '%e %b \'%y %l:%M %p',
        long: '%a, %e %b %Y, %l:%M %p',
    },

    humanReadableDateShort: function (isoDate) {
        if(isoDate) {
            return Date.parseISO8601(isoDate).strftime(Balanced.Utils.date_formats.short);
        } else {
            return isoDate;
        }
    },

    humanReadableDateLong: function (isoDate) {
        if(isoDate) {
            return Date.parseISO8601(isoDate).strftime(Balanced.Utils.date_formats.long);
        } else {
            return isoDate;
        }
    },

    // filters any number that is in the form of a string and longer than 4 digits (bank codes, ccard numbers etc)
    filterSensitiveData: function(str) {
        if(Ember.isNone(str)) {
            return str;
        }
        var strValue = '' + str;
        return strValue.replace(/([0-9])[\s+\-]([0-9])/g, '$1$2').replace(/([0-9]*)([0-9]{4})/g, 'XX-HIDE-XX-$2');
    },

    // Takes a hash and filters out all the sensitive data. Only preserves
    // top-level properties, since mixpanel doesn't do nested properties
    filterSensitivePropertiesMap: function(obj) {
        if(!obj) {
            return obj;
        }

        var ret = {};
        for (var name in obj) {
            if(obj.hasOwnProperty(name)) {
                ret[name] = Balanced.Utils.filterSensitiveData(obj[name]);
            }
        }
        return ret;
    }
};
