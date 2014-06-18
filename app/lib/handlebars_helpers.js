require('app/lib/utils');

Ember.Handlebars.registerBoundHelper('formatCurrency', Balanced.Utils.formatCurrency);

Ember.Handlebars.registerBoundHelper('formatNumber', Balanced.Utils.formatNumber);

Ember.Handlebars.registerBoundHelper('formatError', Balanced.Utils.formatError);

Ember.Handlebars.registerBoundHelper('capitalize', Balanced.Utils.capitalize);

Ember.Handlebars.registerBoundHelper('lowerCase', Balanced.Utils.toLowerCase);

Ember.Handlebars.registerBoundHelper('titleCase', Balanced.Utils.toTitleCase);

Ember.Handlebars.registerBoundHelper('prettyPrint', Balanced.Utils.prettyPrint);

Ember.Handlebars.registerBoundHelper('colorizeStatus', function(status) {
	var statusClass = status.match(/2\d\d/) ? 'ok' : 'error';
	return new Ember.Handlebars.SafeString(
		'<span class="status-%@">%@</span>'.fmt(statusClass, status)
	);
});

Ember.Handlebars.registerBoundHelper('modalFieldErrors', function(errorsList) {
	var errors = Balanced.Utils.formatError(errorsList);
	errors = Ember.Handlebars.Utils.escapeExpression(errors);
	return new Ember.Handlebars.SafeString(
		'<div class="alert alert-error label4b">%@</div>'.fmt(errors)
	);
});

Ember.Handlebars.registerBoundHelper('stringify', function(obj) {
	return new Ember.Handlebars.SafeString(JSON.stringify(obj, null, 4));
});

Ember.Handlebars.registerBoundHelper('humanReadableDate', Balanced.Utils.humanReadableDate);
Ember.Handlebars.registerBoundHelper('humanReadableTime', Balanced.Utils.humanReadableTime);
Ember.Handlebars.registerBoundHelper('humanReadableDateShort', Balanced.Utils.humanReadableDateShort);
Ember.Handlebars.registerBoundHelper('humanReadableDateLong', Balanced.Utils.humanReadableDateLong);
Ember.Handlebars.registerBoundHelper('inflection', function(property, options) {
	var str;

	if (options) {
		var length = property;
		var singularForm = options.hash["singular"];

		if ((parseInt(length, 10) > 1) || (parseInt(length, 10) === 0)) {
			str = length + " " + singularForm + "s";
		} else {
			str = length + " " + singularForm;
		}
	}

	return new Ember.Handlebars.SafeString(str);
});
