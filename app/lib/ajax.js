var csrfToken = $.cookie('csrfToken');

$.ajaxSetup({
    type: 'POST',
    dataType: 'json',
    xhrFields: {
        withCredentials: true
    },
    beforeSend: function (xhr, settings) {
        xhr.setRequestHeader('X-CSRFToken', csrfToken);
    }
});

// POSTing to / will return a csrf token
$.post(Ember.ENV.BALANCED.AUTH).success(function (r) {
    csrfToken = r.csrf;
    $.cookie('csrfToken', csrfToken);
});
