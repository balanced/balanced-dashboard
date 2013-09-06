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
        init: function () {
        },
        loadCSRFToken: function () {
            if(window.TESTING) {
                return;
            }

            // POSTing to / will return a csrf token
            $.ajax({
                type: 'POST',
                url: Ember.ENV.BALANCED.AUTH,
                xhrFields: {
                    withCredentials: true
                }
            }).success(function (r) {
                csrfToken = r.csrf;
                ajaxHeaders['X-CSRFToken'] = csrfToken;
            });
        },
        ajaxHeaders: ajaxHeaders
    };

})();
