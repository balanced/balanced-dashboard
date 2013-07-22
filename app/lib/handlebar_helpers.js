Ember.Handlebars.registerBoundHelper('formatCurrency', Balanced.Utils.formatCurrency);

Ember.Handlebars.registerBoundHelper('capitalize', Balanced.Utils.capitalize);

Ember.Handlebars.registerBoundHelper('titleCase', Balanced.Utils.toTitleCase);

Ember.Handlebars.registerBoundHelper('prettyPrint', Balanced.Utils.prettyPrint);

Ember.Handlebars.registerBoundHelper('colorizeStatus', function(status) {
    if(status.match(/2\d\d/)) {
        return new Ember.Handlebars.SafeString('<span class="status-ok">' + status + '</span>');
    }

    return new Ember.Handlebars.SafeString('<span class="status-error">' + status + '</span>');
});