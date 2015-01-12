import Ember from "ember";
import Constants from "balanced-dashboard/utils/constants";

var FORMAT_NUMBER_REGEX = /\B(?=(\d{3})+(?!\d))/g,
	PRETTY_LOG_URL_REGEX = /\/marketplaces\/[^\/]*\/(.+)$/,
	STRIP_DOMAIN_REGEX = /^.*\/\/[^\/]+/,
	TO_TITLECASE_REGEX = /\w\S*/g,
	SPACE_REPLACE_REGEX = /\s/g,
	UNDERSCORE_REPLACE_REGEX = /_/g,
	PARAM_HELPER_1_REGEX = /[\[]/,
	PARAM_HELPER_2_REGEX = /[\]]/,
	PARAM_URI_DECODE_REGEX = /\+/g,
	FORMAT_CURRENCY_REGEX = /(\d)(?=(\d{3})+\.)/g,
	FORMAT_ERROR_REGEX = /-\s/,
	REMOVE_COMMA_WHITESPACE_REGEX = /,|\s/g,
	CURRENCY_TEST_REGEX = /^([0-9]*(\.[0-9]{0,2})?)$/,
	HIDE_BA_NUMBER_REGEX = /([0-9])[\s+\-]([0-9])/g,
	HIDE_CC_NUMBER_REGEX = /([0-9]*)([0-9]{4})/g;


var Utils = Ember.Namespace.create({

	toDataUri: function(string) {
		return "data:text/plain;charset=utf-8;base64," + window.btoa(string);
	},

	queryStringToObject: function(string) {
		if (string === undefined) {
			return undefined;
		}

		var results = {};
		var pairs = string.split("?")[1].split("&");
		pairs.forEach(function(str) {
			var pair = str.split("=").map(function(s) {
				return window.decodeURIComponent(s);
			});
			results[pair[0]] = pair[1];
		});

		return results;
	},

	objectToQueryString: function(object) {
		return _.map(object, function(v, k) {
			var value = Ember.isBlank(v) ?
				"" :
				v;
			return encodeURIComponent(k) + '=' + encodeURIComponent(value);
		}).join('&');
	},

	stripDomain: function(url) {
		return url.replace(STRIP_DOMAIN_REGEX, '');
	},

	prettyLogUrl: function(url) {
		return Utils.stripDomain(url).replace(PRETTY_LOG_URL_REGEX, '/.../$1').split("?")[0];
	},

	prettyPrint: function(obj) {
		return JSON.stringify(obj, null, 2);
	},

	geoIP: function(ip, callback) {
		if (window.TESTING) {
			return callback("(San Francisco, California, United States)");
		}

		if (ip) {
			return $.ajax('https://freegeoip.net/json/' + ip, {
				dataType: 'jsonp',
				type: 'GET',
				jsonp: 'callback'
			}).then(function(result) {
				var geoIpString;

				if (result.city && result.region_name && result.country_name) {
					geoIpString = '(' + result.city + ', ' + result.region_name + ', ' + result.country_name + ')';
				} else if (result.region_name && result.country_name) {
					geoIpString = '(' + result.region_name + ', ' + result.country_name + ')';
				}

				if (_.isFunction(callback)) {
					return callback(geoIpString);
				} else {
					return geoIpString;
				}
			});
		}
	},

	toTitleCase: function(str) {
		if (!str) {
			return str;
		}

		return str.replace(UNDERSCORE_REPLACE_REGEX, ' ').replace(TO_TITLECASE_REGEX, function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	},

	toLowerCase: function(str) {
		if (!str) {
			return str;
		}

		return str.toLowerCase();
	},

	getParamByName: function(uri, name) {
		name = name.replace(PARAM_HELPER_1_REGEX, "\\\\[").replace(PARAM_HELPER_2_REGEX, "\\\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(uri);
		return results === null ? "" : decodeURIComponent(results[1].replace(PARAM_URI_DECODE_REGEX, " "));
	},

	/*
	 * Inserts or updates a single query string parameter
	 */
	updateQueryStringParameter: function(uri, key, value) {
		var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
		var separator = uri.indexOf("?") > -1 ? "&" : "?";
		if (uri.match(re)) {
			return uri.replace(re, "$1" + key + "=" + value + "$2");
		} else {
			return uri + separator + key + "=" + value;
		}
	},

	sortDict: function(dict) {
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

	formatCurrency: function(cents) {
		if (!cents) {
			return '$0.00';
		}

		var prepend = '$';
		if (cents < 0) {
			cents = cents * -1;
			prepend = '-$';
		}

		return prepend + Utils.centsToDollars(cents);
	},

	formatNumber: function(number) {
		if (!number) {
			return 0;
		}

		return ('' + number).replace(FORMAT_NUMBER_REGEX, ",");
	},

	formatError: function(error) {
		if (error !== null && error !== undefined) {
			if (error.message) {
				// amount validation
				return error.message;
			} else if (error.search === undefined) {
				// ember validation
				return (error.get("messages") || []).join(", ");
			} else {
				// server-side validation
				var split = error.search(FORMAT_ERROR_REGEX);
				if (split !== -1) {
					return error.slice(split + 2);
				}
			}
		}
		return error;
	},

	capitalize: function(str) {
		if (!str) {
			return str;
		}

		return str.charAt(0).toUpperCase() + str.slice(1).replace(UNDERSCORE_REPLACE_REGEX, ' ');
	},

	dollarsToCents: function(dollars) {
		if (!dollars) {
			throw new Error('%@ is not a valid dollar amount'.fmt(dollars));
		}

		// remove commas and whitespace
		dollars = dollars.replace(REMOVE_COMMA_WHITESPACE_REGEX, '');

		// make sure our input looks reasonable now, or else fail
		if (!CURRENCY_TEST_REGEX.test(dollars)) {
			throw new Error('%@ is not a valid dollar amount'.fmt(dollars));
		}

		return Math.round(100 * parseFloat(dollars));
	},

	centsToDollars: function(cents) {
		if (!cents) {
			return '0';
		}

		return (cents / 100).toFixed(2).replace(FORMAT_CURRENCY_REGEX, '$1,');
	},

	toGravatar: function(emailHash) {
		return emailHash ? 'https://secure.gravatar.com/avatar/%@?s=30&d=mm'.fmt(emailHash) : 'https://secure.gravatar.com/avatar?s=30&d=mm';
	},

	setCurrentMarketplace: function(marketplace) {
		var Auth = require("balanced-dashboard/auth")["default"];

		// Store the marketplace in a global so we can use it for auth.
		// TODO: TAKE THIS OUT when we've moved to oAuth
		Ember.set(BalancedApp, 'currentMarketplace', marketplace);
		Auth.set('currentMarketplace', marketplace);
		if (marketplace) {
			Auth.rememberLastUsedMarketplaceUri(marketplace.get('uri'));

			var userMarketplace = Auth.get('user').user_marketplace_for_id(marketplace.get('id'));
			if (userMarketplace) {
				Auth.setAPIKey(userMarketplace.get('secret'));
			} else {
				Ember.Logger.warn("Couldn't find API key for %@".fmt(marketplace.get('uri')));
			}
		}
	},

	applyUriFilters: function(uri, params) {
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
				case 'search':
					filteringParams['type[in]'] = Constants.SEARCH.SEARCH_TYPES.join(',');
					break;
				case 'transaction':
					filteringParams['type[in]'] = Constants.SEARCH.TRANSACTION_TYPES.join(',');
					break;
				case 'funding_instrument':
					filteringParams['type[in]'] = Constants.SEARCH.FUNDING_INSTRUMENT_TYPES.join(',');
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
		filteringParams = Utils.sortDict(filteringParams);
		return this.buildUri(uri, filteringParams);
	},

	buildUri: function(path, queryStringObject) {
		var queryString = _.isString(queryStringObject) ?
			queryStringObject :
			this.objectToQueryString(queryStringObject);
		return Ember.isBlank(queryString) ?
			path :
			path + "?" + queryString;
	},

	/*
	 * This function checks whether data is loaded, when it is loaded, loadedFunc
	 * is called and the result is returned. Otherwise, result of loadingFunc()
	 * will be returned and callback(loadedFunc()) will be called once the data is loaded
	 *
	 * It is very useful for getting a loading message when it is loading,
	 * update the information later with the data is loaded.
	 */
	maybeDeferredLoading: function(data, callback, loadingFunc, loadedFunc) {
		// the data is already loaded
		if (data.isLoaded) {
			return loadedFunc();
		}

		// called when data is loaded
		data.on('didLoad', function() {
			callback(loadedFunc());
		});
		return loadingFunc();
	},

	combineUri: function(baseUri, path) {
		if (!baseUri || !path) {
			throw new Error("Can't combine URIs: %@ %@".fmt(baseUri, path));
		}

		// strip trailing slash
		if (baseUri[baseUri.length - 1] === '/') {
			baseUri = baseUri.substring(0, baseUri.length - 1);
		}

		// strip leading slash
		if (path[0] === '/') {
			path = path.substring(1);
		}

		return baseUri + '/' + path;
	},

	date_formats: {
		date: 'MMM D, YYYY',
		time: 'h:mm A',
		date_time: 'MMM D, YYYY, h:mm A',
		short: 'M/D/YYYY, h:mm A',
		long: 'MMMM D YYYY, h:mm A',
	},

	formatDate: function(date, format) {
		if (_.isDate(date)) {
			return moment(date).format(format);
		} else if (_.isString(date)) {
			// As of Sept 22 2014 there is an issue with log api results returning the time zone as
			// "+00:00Z" which is not being parsed as valid ISO_8601
			// https://github.com/balanced/balanced/issues/644
			return moment(date.replace(/\+00:00Z$/, "Z"), moment.ISO_8601).format(format);
		} else {
			return date;
		}
	},

	humanReadableDateTime: function(isoDate) {
		return Utils.formatDate(isoDate, Utils.date_formats.date_time);
	},

	humanReadableDate: function(isoDate) {
		return Utils.formatDate(isoDate, Utils.date_formats.date);
	},

	humanReadableTime: function(isoDate) {
		return Utils.formatDate(isoDate, Utils.date_formats.time);
	},

	humanReadableDateShort: function(isoDate) {
		return Utils.formatDate(isoDate, Utils.date_formats.short);
	},

	humanReadableDateLong: function(isoDate) {
		return Utils.formatDate(isoDate, Utils.date_formats.long);
	},

	// filters any number that is in the form of a string and longer than 4 digits (bank codes, ccard numbers etc)
	filterSensitiveData: function(str) {
		if (Ember.isNone(str)) {
			return str;
		}
		var strValue = '' + str;
		return strValue.replace(HIDE_BA_NUMBER_REGEX, '$1$2').replace(HIDE_CC_NUMBER_REGEX, 'XX-HIDE-XX-$2');
	},

	// Takes a hash and filters out all the sensitive data. Only preserves
	// top-level properties, since mixpanel doesn't do nested properties
	filterSensitivePropertiesMap: function(obj) {
		if (!obj) {
			return obj;
		}

		var ret = {};
		for (var name in obj) {
			if (obj.hasOwnProperty(name)) {
				ret[name] = Utils.filterSensitiveData(obj[name]);
			}
		}
		return ret;
	},

	encodeAuthorization: function(apiKey) {
		return 'Basic ' + window.btoa(apiKey + ':');
	},

	extractValidationErrorHash: function(errorsRoot) {
		var errorsHash = {};
		_.each(errorsRoot.errors, function(error) {
			for (var key in error.extras) {
				errorsHash[key] = error.extras[key];
			}
		});
		return errorsHash;
	},

	traverse: function(o, fn, ctx, addlKey) {
		addlKey = addlKey || '';

		_.each(o, function(val, key) {
			fn.call(this, val, addlKey + key);

			if (_.isObject(val)) {
				Utils.traverse(val, fn, ctx, key + '.');
			}
		}, ctx);
	},

	safeFormat: function(template) {
		var args = _.toArray(arguments).slice(1).map(function(str) {
			return Ember.Handlebars.Utils.escapeExpression(str);
		});
		return template.fmt.apply(template, args);
	},

	formatBankName: function(bankName) {
		var formattedBankName = Utils.toTitleCase(bankName);

		_.each(Constants.BANK_NAMES, function(unformattedArr, formattedStr) {
			_.each(unformattedArr, function(unformattedStr) {
				formattedBankName = formattedBankName.replace(unformattedStr, formattedStr);
			});
		});

		return formattedBankName;
	},

	formatStatusCode: function(statusCode) {
		if (statusCode) {
			return Utils.capitalize(statusCode.replace(/-/g, ' '));
		} else {
			return null;
		}
	},

	formatFileSize: function(bytes) {
		if (bytes >= 1000000000) {
			bytes = (bytes / 1000000000).toFixed(2) + ' gb';
		} else if (bytes >= 1000000) {
			bytes = (bytes / 1000000).toFixed(2) + ' mb';
		} else if (bytes >= 1000) {
			bytes = (bytes / 1000).toFixed(2) + ' kb';
		} else if (bytes > 1) {
			bytes = bytes + ' bytes';
		} else if (bytes === 1) {
			bytes = bytes + ' byte';
		} else {
			bytes = '0 byte';
		}
		return bytes;
	},

	getCurrentYear: function() {
		return moment().get("year");
	}
});

export default Utils;
