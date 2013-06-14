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
	    Balanced.Analytics && _.defer(Balanced.Analytics.trackAjax, settings);
            for (var key in ajaxHeaders) {
                if (!ajaxHeaders.hasOwnProperty(key)) {
                    continue;
                }
                xhr.setRequestHeader(key, ajaxHeaders[key]);
            }
        }
    });

    return {
        init: function () {
            if (!window.TESTING) {
                // POSTing to / will return a csrf token
                $.post(Ember.ENV.BALANCED.AUTH).success(function (r) {
                    csrfToken = r.csrf;
                    $.cookie(Balanced.COOKIE.CSRF_TOKEN, csrfToken);
                    ajaxHeaders['X-CSRFToken'] = csrfToken;
                });
            }
        },
        ajaxHeaders: ajaxHeaders
    };

})();
