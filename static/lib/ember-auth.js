/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */

(function (factory) {
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	function converted(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		try {
			return config.json ? JSON.parse(s) : s;
		} catch(er) {}
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		var result = key ? undefined : {};
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = decode(parts.join('='));

			if (key && key === name) {
				result = converted(cookie);
				break;
			}

			if (!key) {
				result[name] = converted(cookie);
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			$.cookie(key, '', $.extend(options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));
/*
 * JQuery URL Parser plugin, v2.2.1
 * Developed and maintanined by Mark Perkins, mark@allmarkedup.com
 * Source repository: https://github.com/allmarkedup/jQuery-URL-Parser
 * Licensed under an MIT-style license. See https://github.com/allmarkedup/jQuery-URL-Parser/blob/master/LICENSE for details.
 */
 

;(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD available; use anonymous module
		if ( typeof jQuery !== 'undefined' ) {
			define(['jquery'], factory);	
		} else {
			define([], factory);
		}
	} else {
		// No AMD available; mutate global vars
		if ( typeof jQuery !== 'undefined' ) {
			factory(jQuery);
		} else {
			factory();
		}
	}
})(function($, undefined) {
	
	var tag2attr = {
			a       : 'href',
			img     : 'src',
			form    : 'action',
			base    : 'href',
			script  : 'src',
			iframe  : 'src',
			link    : 'href'
		},
		
		key = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'], // keys available to query
		
		aliases = { 'anchor' : 'fragment' }, // aliases for backwards compatability
		
		parser = {
			strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  //less intuitive, more accurate to the specs
			loose :  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
		},
		
		toString = Object.prototype.toString,
		
		isint = /^[0-9]+$/;
	
	function parseUri( url, strictMode ) {
		var str = decodeURI( url ),
		res   = parser[ strictMode || false ? 'strict' : 'loose' ].exec( str ),
		uri = { attr : {}, param : {}, seg : {} },
		i   = 14;
		
		while ( i-- ) {
			uri.attr[ key[i] ] = res[i] || '';
		}
		
		// build query and fragment parameters		
		uri.param['query'] = parseString(uri.attr['query']);
		uri.param['fragment'] = parseString(uri.attr['fragment']);
		
		// split path and fragement into segments		
		uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g,'').split('/');     
		uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g,'').split('/');
		
		// compile a 'base' domain attribute        
		uri.attr['base'] = uri.attr.host ? (uri.attr.protocol ?  uri.attr.protocol+'://'+uri.attr.host : uri.attr.host) + (uri.attr.port ? ':'+uri.attr.port : '') : '';      
		  
		return uri;
	};
	
	function getAttrName( elm ) {
		var tn = elm.tagName;
		if ( typeof tn !== 'undefined' ) return tag2attr[tn.toLowerCase()];
		return tn;
	}
	
	function promote(parent, key) {
		if (parent[key].length == 0) return parent[key] = {};
		var t = {};
		for (var i in parent[key]) t[i] = parent[key][i];
		parent[key] = t;
		return t;
	}

	function parse(parts, parent, key, val) {
		var part = parts.shift();
		if (!part) {
			if (isArray(parent[key])) {
				parent[key].push(val);
			} else if ('object' == typeof parent[key]) {
				parent[key] = val;
			} else if ('undefined' == typeof parent[key]) {
				parent[key] = val;
			} else {
				parent[key] = [parent[key], val];
			}
		} else {
			var obj = parent[key] = parent[key] || [];
			if (']' == part) {
				if (isArray(obj)) {
					if ('' != val) obj.push(val);
				} else if ('object' == typeof obj) {
					obj[keys(obj).length] = val;
				} else {
					obj = parent[key] = [parent[key], val];
				}
			} else if (~part.indexOf(']')) {
				part = part.substr(0, part.length - 1);
				if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
				parse(parts, obj, part, val);
				// key
			} else {
				if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
				parse(parts, obj, part, val);
			}
		}
	}

	function merge(parent, key, val) {
		if (~key.indexOf(']')) {
			var parts = key.split('['),
			len = parts.length,
			last = len - 1;
			parse(parts, parent, 'base', val);
		} else {
			if (!isint.test(key) && isArray(parent.base)) {
				var t = {};
				for (var k in parent.base) t[k] = parent.base[k];
				parent.base = t;
			}
			set(parent.base, key, val);
		}
		return parent;
	}

	function parseString(str) {
		return reduce(String(str).split(/&|;/), function(ret, pair) {
			try {
				pair = decodeURIComponent(pair.replace(/\+/g, ' '));
			} catch(e) {
				// ignore
			}
			var eql = pair.indexOf('='),
				brace = lastBraceInKey(pair),
				key = pair.substr(0, brace || eql),
				val = pair.substr(brace || eql, pair.length),
				val = val.substr(val.indexOf('=') + 1, val.length);

			if ('' == key) key = pair, val = '';

			return merge(ret, key, val);
		}, { base: {} }).base;
	}
	
	function set(obj, key, val) {
		var v = obj[key];
		if (undefined === v) {
			obj[key] = val;
		} else if (isArray(v)) {
			v.push(val);
		} else {
			obj[key] = [v, val];
		}
	}
	
	function lastBraceInKey(str) {
		var len = str.length,
			 brace, c;
		for (var i = 0; i < len; ++i) {
			c = str[i];
			if (']' == c) brace = false;
			if ('[' == c) brace = true;
			if ('=' == c && !brace) return i;
		}
	}
	
	function reduce(obj, accumulator){
		var i = 0,
			l = obj.length >> 0,
			curr = arguments[2];
		while (i < l) {
			if (i in obj) curr = accumulator.call(undefined, curr, obj[i], i, obj);
			++i;
		}
		return curr;
	}
	
	function isArray(vArg) {
		return Object.prototype.toString.call(vArg) === "[object Array]";
	}
	
	function keys(obj) {
		var keys = [];
		for ( prop in obj ) {
			if ( obj.hasOwnProperty(prop) ) keys.push(prop);
		}
		return keys;
	}
		
	function purl( url, strictMode ) {
		if ( arguments.length === 1 && url === true ) {
			strictMode = true;
			url = undefined;
		}
		strictMode = strictMode || false;
		url = url || window.location.toString();
	
		return {
			
			data : parseUri(url, strictMode),
			
			// get various attributes from the URI
			attr : function( attr ) {
				attr = aliases[attr] || attr;
				return typeof attr !== 'undefined' ? this.data.attr[attr] : this.data.attr;
			},
			
			// return query string parameters
			param : function( param ) {
				return typeof param !== 'undefined' ? this.data.param.query[param] : this.data.param.query;
			},
			
			// return fragment parameters
			fparam : function( param ) {
				return typeof param !== 'undefined' ? this.data.param.fragment[param] : this.data.param.fragment;
			},
			
			// return path segments
			segment : function( seg ) {
				if ( typeof seg === 'undefined' ) {
					return this.data.seg.path;
				} else {
					seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1; // negative segments count from the end
					return this.data.seg.path[seg];                    
				}
			},
			
			// return fragment segments
			fsegment : function( seg ) {
				if ( typeof seg === 'undefined' ) {
					return this.data.seg.fragment;                    
				} else {
					seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1; // negative segments count from the end
					return this.data.seg.fragment[seg];                    
				}
			}
	    	
		};
	
	};
	
	if ( typeof $ !== 'undefined' ) {
		
		$.fn.url = function( strictMode ) {
			var url = '';
			if ( this.length ) {
				url = $(this).attr( getAttrName(this[0]) ) || '';
			}    
			return purl( url, strictMode );
		};
		
		$.url = purl;
		
	} else {
		window.purl = purl;
	}

});

(function() {
  var evented, exports;

  exports = exports != null ? exports : this;

  evented = Em.Object.extend(Em.Evented);

  exports.Auth = evented.create({
    authToken: null,
    currentUserId: null,
    currentUser: null,
    jqxhr: null,
    prevRoute: null,
    json: null,
    signIn: function(data) {
      var async,
        _this = this;

      if (data == null) {
        data = {};
      }
      async = data.async != null ? data.async : true;
      if (data.async != null) {
        delete data['async'];
      }
      return this.ajax({
        url: this.resolveUrl(Auth.Config.get('tokenCreateUrl')),
        type: 'POST',
        data: data,
        async: async
      }).done(function(json, status, jqxhr) {
        var model;

        _this.set('authToken', json[Auth.Config.get('tokenKey')]);
        _this.set('currentUserId', json[Auth.Config.get('idKey')]);
        if (model = Auth.Config.get('userModel')) {
          _this.set('currentUser', model.find(_this.get('currentUserId')));
        }
        _this.set('json', json);
        _this.set('jqxhr', jqxhr);
        return _this.trigger('signInSuccess');
      }).fail(function(jqxhr) {
        _this.set('jqxhr', jqxhr);
        return _this.trigger('signInError');
      }).always(function(jqxhr) {
        _this.set('prevRoute', null);
        _this.set('jqxhr', jqxhr);
        return _this.trigger('signInComplete');
      });
    },
    signOut: function(data) {
      var async,
        _this = this;

      if (data == null) {
        data = {};
      }
      data[Auth.Config.get('tokenKey')] = this.get('authToken');
      async = data.async != null ? data.async : true;
      if (data.async != null) {
        delete data['async'];
      }
      return this.ajax({
        url: this.resolveUrl(Auth.Config.get('tokenDestroyUrl')),
        type: 'DELETE',
        data: data,
        async: async
      }).done(function(json, status, jqxhr) {
        _this.set('authToken', null);
        _this.set('currentUserId', null);
        _this.set('currentUser', null);
        _this.set('jqxhr', jqxhr);
        _this.set('json', json);
        return _this.trigger('signOutSuccess');
      }).fail(function(jqxhr) {
        _this.set('jqxhr', jqxhr);
        return _this.trigger('signOutError');
      }).always(function(jqxhr) {
        _this.set('prevRoute', null);
        _this.set('jqxhr', jqxhr);
        return _this.trigger('signOutComplete');
      });
    },
    resolveUrl: function(path) {
      var base;

      base = Auth.Config.get('baseUrl');
      if (base && base[base.length - 1] === '/') {
        base = base.substr(0, base.length - 1);
      }
      if ((path != null ? path[0] : void 0) === '/') {
        path = path.substr(1, path.length);
      }
      return [base, path].join('/');
    },
    resolveRedirectRoute: function(type) {
      var fallback, isSmart, sameRoute, typeClassCase;

      if (type !== 'signIn' && type !== 'signOut') {
        return null;
      }
      typeClassCase = "" + (type[0].toUpperCase()) + (type.slice(1));
      isSmart = Auth.Config.get("smart" + typeClassCase + "Redirect");
      fallback = Auth.Config.get("" + type + "RedirectFallbackRoute");
      sameRoute = Auth.Config.get("" + type + "Route");
      if (!isSmart) {
        return fallback;
      }
      if ((this.prevRoute == null) || this.prevRoute === sameRoute) {
        return fallback;
      } else {
        return this.prevRoute;
      }
    },
    ajax: function(settings) {
      var data, def, e, token, _base, _base1, _base2, _name, _name1, _name2;

      if (settings == null) {
        settings = {};
      }
      def = {};
      def.dataType = 'json';
      if (settings.data && (settings.contentType == null) && settings.type !== 'GET') {
        def.contentType = 'application/json; charset=utf-8';
        settings.data = JSON.stringify(settings.data);
      }
      settings = jQuery.extend(def, settings);
      if (token = this.get('authToken')) {
        switch (Auth.Config.get('requestTokenLocation')) {
          case 'param':
            settings.data || (settings.data = {});
            switch (typeof settings.data) {
              case 'object':
                if (window.FormData && settings.data instanceof window.FormData) {
                  settings.data.append(Auth.Config.get('tokenKey'), this.get('authToken'));
                } else {
                  (_base = settings.data)[_name = Auth.Config.get('tokenKey')] || (_base[_name] = this.get('authToken'));
                }
                break;
              case 'string':
                try {
                  data = JSON.parse(settings.data);
                  data[_name1 = Auth.Config.get('tokenKey')] || (data[_name1] = this.get('authToken'));
                  settings.data = JSON.stringify(data);
                } catch (_error) {
                  e = _error;
                }
            }
            break;
          case 'authHeader':
            settings.headers || (settings.headers = {});
            (_base1 = settings.headers)['Authorization'] || (_base1['Authorization'] = "" + (Auth.Config.get('requestHeaderKey')) + " " + (this.get('authToken')));
            break;
          case 'customHeader':
            settings.headers || (settings.headers = {});
            (_base2 = settings.headers)[_name2 = Auth.Config.get('requestHeaderKey')] || (_base2[_name2] = this.get('authToken'));
        }
      }
      return jQuery.ajax(settings);
    }
  });

}).call(this);
(function() {
  Auth.Config = Em.Object.create({
    tokenCreateUrl: null,
    tokenDestroyUrl: null,
    tokenKey: null,
    idKey: null,
    userModel: null,
    baseUrl: null,
    requestTokenLocation: 'param',
    requestHeaderKey: null,
    signInRoute: null,
    signOutRoute: null,
    authRedirect: false,
    smartSignInRedirect: false,
    smartSignOutRedirect: false,
    signInRedirectFallbackRoute: 'index',
    signOutRedirectFallbackRoute: 'index',
    rememberMe: false,
    rememberTokenKey: null,
    rememberPeriod: 14,
    rememberAutoRecall: true,
    rememberAutoRecallRouteScope: 'auth',
    rememberStorage: 'cookie',
    urlAuthentication: false,
    urlAuthenticationParamsKey: null,
    urlAuthenticationRouteScope: 'auth'
  });

}).call(this);
(function() {
  Auth.Route = Em.Route.extend(Em.Evented, {
    redirect: function() {
      if (Auth.get('authToken')) {
        return this._super.apply(this, arguments);
      }
      if (Auth.Config.get('urlAuthentication')) {
        Auth.Module.UrlAuthentication.authenticate({
          async: false
        });
        if (Auth.get('authToken')) {
          return this._super.apply(this, arguments);
        }
      }
      if (Auth.Config.get('rememberMe') && Auth.Config.get('rememberAutoRecall')) {
        Auth.Module.RememberMe.recall({
          async: false
        });
        if (Auth.get('authToken')) {
          return this._super.apply(this, arguments);
        }
      }
      this.trigger('authAccess');
      if (Auth.Config.get('authRedirect')) {
        Auth.set('prevRoute', this.routeName);
        this.transitionTo(Auth.Config.get('signInRoute'));
      }
      return this._super.apply(this, arguments);
    }
  });

}).call(this);
(function() {
  Em.Route.reopen({
    redirect: function() {
      if (Auth.Config.get('urlAuthentication') && Auth.Config.get('urlAuthenticationRouteScope') === 'both') {
        Auth.Module.UrlAuthentication.authenticate({
          async: false
        });
        if (Auth.get('authToken')) {
          return this._super.apply(this, arguments);
        }
      }
      if (Auth.Config.get('rememberMe') && Auth.Config.get('rememberAutoRecall') && Auth.Config.get('rememberAutoRecallRouteScope') === 'both') {
        Auth.Module.RememberMe.recall({
          async: false
        });
        if (Auth.get('authToken')) {
          return this._super.apply(this, arguments);
        }
      }
      return this._super.apply(this, arguments);
    }
  });

}).call(this);
(function() {
  Auth.SignInController = Em.Mixin.create({
    registerRedirect: function() {
      return Auth.addObserver('authToken', this, 'smartSignInRedirect');
    },
    smartSignInRedirect: function() {
      if (Auth.get('authToken')) {
        this.transitionToRoute(Auth.resolveRedirectRoute('signIn'));
        return Auth.removeObserver('authToken', this, 'smartSignInRedirect');
      }
    }
  });

}).call(this);
(function() {
  Auth.SignOutController = Em.Mixin.create({
    registerRedirect: function() {
      return Auth.addObserver('authToken', this, 'smartSignOutRedirect');
    },
    smartSignOutRedirect: function() {
      if (!Auth.get('authToken')) {
        this.transitionToRoute(Auth.resolveRedirectRoute('signOut'));
        return Auth.removeObserver('authToken', this, 'smartSignOutRedirect');
      }
    }
  });

}).call(this);
(function() {
  if ((typeof DS !== "undefined" && DS !== null) && (DS.RESTAdapter != null)) {
    Auth.RESTAdapter = DS.RESTAdapter.extend({
      ajax: function(url, type, settings) {
        settings = settings || {};
        settings.url = url;
        settings.type = type;
        settings.context = this;
        return Auth.ajax(settings);
      }
    });
  }

}).call(this);
(function() {
  Auth.Module = Em.Object.create();

}).call(this);
(function() {
  Auth.Module.RememberMe = Em.Object.create({
    init: function() {
      var _this = this;

      Auth.on('signInSuccess', function() {
        return _this.remember();
      });
      Auth.on('signInError', function() {
        return _this.forget();
      });
      return Auth.on('signOutSuccess', function() {
        return _this.forget();
      });
    },
    recall: function(opts) {
      var data, token;

      if (opts == null) {
        opts = {};
      }
      if (!Auth.Config.get('rememberMe')) {
        return;
      }
      if (!Auth.get('authToken') && (token = this.retrieveToken())) {
        this.fromRecall = true;
        data = {};
        if (opts.async != null) {
          data['async'] = opts.async;
        }
        data[Auth.Config.get('rememberTokenKey')] = token;
        return Auth.signIn(data);
      }
    },
    remember: function() {
      var token;

      if (!Auth.Config.get('rememberMe')) {
        return;
      }
      token = Auth.get('json')[Auth.Config.get('rememberTokenKey')];
      if (token) {
        if (token !== this.retrieveToken()) {
          this.storeToken(token);
        }
      } else {
        if (!this.fromRecall) {
          this.forget();
        }
      }
      return this.fromRecall = false;
    },
    forget: function() {
      if (!Auth.Config.get('rememberMe')) {
        return;
      }
      return this.removeToken();
    },
    retrieveToken: function() {
      switch (Auth.Config.get('rememberStorage')) {
        case 'localStorage':
          return localStorage.getItem('ember-auth-remember-me');
        case 'cookie':
          return jQuery.cookie('ember-auth-remember-me');
      }
    },
    storeToken: function(token) {
      switch (Auth.Config.get('rememberStorage')) {
        case 'localStorage':
          return localStorage.setItem('ember-auth-remember-me', token);
        case 'cookie':
          return jQuery.cookie('ember-auth-remember-me', token, {
            expires: Auth.Config.get('rememberPeriod'),
            path: '/'
          });
      }
    },
    removeToken: function() {
      switch (Auth.Config.get('rememberStorage')) {
        case 'localStorage':
          return localStorage.removeItem('ember-auth-remember-me');
        case 'cookie':
          return jQuery.removeCookie('ember-auth-remember-me', {
            path: '/'
          });
      }
    }
  });

}).call(this);
(function() {
  Auth.Module.UrlAuthentication = Em.Object.create({
    authenticate: function(opts) {
      var data;

      if (opts == null) {
        opts = {};
      }
      if (!Auth.Config.get('urlAuthentication')) {
        return;
      }
      if (Auth.get('authToken')) {
        return;
      }
      this.canonicalizeParams();
      if ($.isEmptyObject(this.params)) {
        return;
      }
      data = {};
      if (opts.async != null) {
        data['async'] = opts.async;
      }
      data = $.extend(data, this.params);
      return Auth.signIn(data);
    },
    retrieveParams: function() {
      var key;

      if (!Auth.Config.get('urlAuthentication')) {
        return;
      }
      key = Auth.Config.get('urlAuthenticationParamsKey');
      return this.params = $.url().param(key);
    },
    canonicalizeParams: function(obj) {
      var canonicalized, k, params, v, _i, _len;

      if (obj == null) {
        obj = this.params;
      }
      params = {};
      if (obj == null) {
        params = {};
      } else if ($.isArray(obj)) {
        for (k = _i = 0, _len = obj.length; _i < _len; k = ++_i) {
          v = obj[k];
          params[k] = v;
        }
      } else if (typeof obj !== 'object') {
        params[String(obj)] = String(obj);
      } else {
        params = obj;
      }
      canonicalized = {};
      for (k in params) {
        v = params[k];
        k = String(k);
        if (k && k.charAt(k.length - 1) === '/') {
          k = k.slice(0, -1);
        }
        if (typeof v === 'object') {
          canonicalized[k] = this.canonicalizeParams(v);
        } else {
          v = String(v);
          if (v && v.charAt(v.length - 1) === '/') {
            v = v.slice(0, -1);
          }
          canonicalized[k] = v;
        }
      }
      return this.params = canonicalized;
    }
  });

  Em.Router.reopen({
    init: function() {
      if (Auth.Config.get('urlAuthentication')) {
        Auth.Module.UrlAuthentication.retrieveParams();
      }
      return this._super.apply(this, arguments);
    }
  });

}).call(this);
(function() {


}).call(this);
