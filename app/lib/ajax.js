require('app/lib/variables');

Balanced.NET = (function () {

	var csrfToken = $.cookie(Balanced.COOKIE.CSRF_TOKEN);

	var ajaxHeaders = {
		'X-CSRFToken': csrfToken
	};

	$.ajaxSetup({
		type: 'POST',
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		beforeSend: function (xhr, settings) {
			for (var key in ajaxHeaders) {
				if (!ajaxHeaders.hasOwnProperty(key)) {
					continue;
				}
				xhr.setRequestHeader(key, ajaxHeaders[key]);
			}
		}
	});

	return {
		loadCSRFToken: function () {
			if(window.TESTING) {
				return;
			}

			// POSTing to / will return a csrf token
			return $.ajax({
				type: 'POST',
				url: Ember.ENV.BALANCED.AUTH,
				xhrFields: {
					withCredentials: true
				}
			}).success(function (response, status, jqxhr) {
				csrfToken = response.csrf;
				Balanced.NET.ajaxHeaders['X-CSRFToken'] = csrfToken;
			});
		},
		ajaxHeaders: ajaxHeaders,

		ajax: function(settings) {
			if (null == settings) {
				settings = {};
			}

			var def = {
				'dataType': 'json'
			};

			if (settings.data && Ember.isNone(settings.contentType)) {
				if(settings.type && settings.type.toUpperCase !== 'GET') {
					def.contentType = 'application/json; charset=utf-8';
					settings.data  = JSON.stringify(settings.data);
				}
			}
			settings = $.extend(def, settings);

			return $.ajax(settings);
		}
	};

})();
