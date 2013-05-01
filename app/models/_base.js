Balanced.Model = Ember.Object.extend({

});

Balanced.Model.ajax = function(url, type, settings) {
    settings = settings || {};
    settings.url = url;
    settings.type = type;
    settings.context = this;
    return Auth.ajax(settings);
};
