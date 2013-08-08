(function ($) {
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $.fn.highlightWords = function (words) {
        var TEXT_NODE = 3;

        var $that = $(this);

        function getTextNodesIn(node, includeWhitespaceNodes) {
            var textNodes = [], whitespace = /^\s*$/;

            function getTextNodes(node) {
                if (node.nodeType === TEXT_NODE) {
                    if (includeWhitespaceNodes || !whitespace.test(node.nodeValue)) {
                        textNodes.push(node);
                    }
                } else {
                    for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                        getTextNodes(node.childNodes[i]);
                    }
                }
            }

            getTextNodes(node);
            return textNodes;
        }

        function removeHighlights() {
            var tables = $that;

            for (var k = 0; k < tables.length; k++) {
                var nodes = getTextNodesIn(tables[k]);
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    var parentNode = node.parentNode;

                    if (parentNode.className && parentNode.className.indexOf('highlight') !== -1) {
                        // node = "Hello world"
                        // parentNode = "<span class="highlight">Hello world</span>"
                        // parentNode.parentNode.replaceChild(node, parentNode)
                        var gpNode = parentNode.parentNode;
                        gpNode.replaceChild(node, parentNode);
                    }
                }
            }
        }

        function makeTextNodeContiguous(re, litUp) {
            var $t = $(this);
            var contiguous = [];

            // join separate text nodes into a single continual node.
            // e.g. "j" "ohn" becomes "john"
            // should remove the subsequent nodes and leave only the first
            // node which is replaced with the joined content
            function joinContiguous(contiguous) {
                if (!contiguous.length) {
                    return;
                }

                // add them all together
                var condensedValue = $.map(contiguous, function (el) {
                    return el.nodeValue;
                });

                // the first element is the one we will replace so get a
                // reference
                var el = contiguous.pop();

                //  remove all the other nodes
                var e;
                while ((e = contiguous.pop())) {
                    $t[0].removeChild(e);
                }
                var replacable = condensedValue.join('');
                $t.find(el).replaceWith(replacable.replace(re, litUp));
            }

            // for each direct child node, let's check if it's text. add all
            // those to a collection and then join once we meet a non-text node
            $t.contents().each(function () {
                if (this.nodeType === TEXT_NODE) {
                    contiguous.push(this);
                } else {
                    joinContiguous(contiguous);
                }
            });
            joinContiguous(contiguous);
        }

        function highlightWord(word) {
            // http://stackoverflow.com/a/6969486/6084 - escape regex chars
            var wordre = word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            var re = new RegExp('(' + wordre + ')', 'gi');
            var litUp = '<span class="highlight">$1</span>';
            $(':icontains(' + word + ')', $that).not('.highlight').each(function () {
                makeTextNodeContiguous.call(this, re, litUp);
            });
        }

        words = $.map(words.split(' '), function (word) {
            return (word) ? word : null;
        });

        removeHighlights();

        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            highlightWord(word);
        }

    };
})(jQuery);

// http://css-tricks.com/snippets/jquery/make-jquery-contains-case-insensitive/
$.expr[":"].icontains = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

// http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
if (!String.prototype.format) {
    var re = new RegExp('{(\\d+)}', 'g');
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(re, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };
}

Balanced.Helpers = (function () {
    // example of how to parse and format iso8601 dates. will parse the
    // specified format and then attach the original unparsed date as a title
    // attribute. may not be needed since we don't render the time info on the
    // server.
    function parseDateTime() {
        var $t = $(this);
        var dt = $t.attr('datetime');
        var format = $t.data('format');
        if (!dt || dt.indexOf('T') === -1) {
            return;
        }
        var x = Date.parseISO8601(dt).strftime(format);
        if (x.toUpperCase().indexOf('UNDEFINED') === -1 && x.toUpperCase().indexOf('NAN') === -1) {
            $t.text(x);
            if (!$t.attr('title')) {
                $t.attr('title', dt);
            }
        }
    }

    function calculateContentHeight() {
        var $content = $('#content');
        if (!$content.length) {
            return;
        }
        var height = $content.height();
        var padding = (+$content.css('padding-top').replace('px', '')) + (+$content.css('padding-bottom').replace('px', ''));
        return (+height + (+padding)) + 'px';
    }

    return {
        init: function () {
            $('time[data-format]').each(parseDateTime);
            Balanced.Helpers.navigationTimer = setInterval(Balanced.Helpers.updateNavigationHeight, 50);
        },

        updateNavigationHeight: function () {
            var height = calculateContentHeight();
            if (height) {
                $('#marketplace-nav').height(height);
            }
        }
    };
})();

Balanced.Utils = {
    uriToDashboardFragment: function (uri) {
        // have to strip off the API version
        return uri.substring(3);
    },

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
        if (cents !== null) {
            return '$' + (cents / 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
    },

    capitalize: function (str) {
        if (!str) {
            return str;
        }

        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    dollarsToCents: function (dollars) {
        if (!dollars) {
            throw new Error('{0} is not a valid dollar amount'.format(dollars));
        }

        // remove commas and whitespace
        dollars = dollars.replace(/,|\s/g, '');

        // make sure our input looks reasonable now, or else fail
        if (!/^([0-9]*(\.[0-9]{0,2})?)$/.test(dollars)) {
            throw new Error('{0} is not a valid dollar amount'.format(dollars));
        }

        return Math.round(100 * parseFloat(dollars));
    },

    toGravatar: function (emailHash) {
        return emailHash ? 'https://secure.gravatar.com/avatar/{0}?s=30&d=mm'.format(emailHash) : 'https://secure.gravatar.com/avatar?s=30&d=mm';
    },

    setCurrentMarketplace: function (marketplace) {
        // Store the marketplace in a global so we can use it for auth.
        // TODO: TAKE THIS OUT when we've moved to oAuth
        Balanced.currentMarketplace = marketplace;
        if (marketplace) {
            Balanced.COOKIE.set(Balanced.COOKIE.MARKETPLACE_URI, marketplace.get('uri'), {
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
            return k + '=' + v;
        }).join('&');

        uri += '?' + encodeURI(queryString);

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

        var route_name;
        var link_view = Ember.LinkView;
        // is this a transaction route?
        var transaction_route = false;
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
                route_name = 'customer';
                link_view = Balanced.AccountLinkView;
                break;
            case Balanced.Customer:
                route_name = 'customer';
                break;
            case Balanced.BankAccount:
                route_name = 'bank_account';
                break;
            case Balanced.Card:
                route_name = 'card';
                break;
            case Balanced.Credit:
                route_name = 'credits.credit';
                transaction_route = true;
                break;
            case Balanced.Debit:
                route_name = 'debits.debit';
                transaction_route = true;
                break;
            case Balanced.Hold:
                route_name = 'holds.hold';
                transaction_route = true;
                break;
            case Balanced.Refund:
                route_name = 'refunds.refund';
                transaction_route = true;
                break;
            case Balanced.Log:
                route_name = 'logs.log';
                break;
            default:
                throw new Ember.Error('not supported model {0}'.format(obj));
        }
        /*
         * When it is a transaction route, as it uses iframe now,
         * we need to transform the model object into another form.
         * That is done by model method of Balanced.IframeRoute.
         * However, when we pass the object directly to a LinkView,
         * the object will be used directly, and the route.model will not
         * be called. In this case, we call the model method manually here
         * to transform the object before passing to LinkView to solve the problem.
         *
         * We can get rid of this little hack when iframe is replaced
         */
        if (transaction_route) {
            var route = this.get('container').lookup('route:' + route_name);
            var route_params = {};
            route_params[route.get('param')] = obj.get('id');
            obj = route.model(route_params);
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
    }
};
