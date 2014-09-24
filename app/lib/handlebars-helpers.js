import Ember from "ember";
import Utils from 'balanced-dashboard/lib/utils';

Ember.Handlebars.registerBoundHelper('formatCurrency', Utils.formatCurrency);

Ember.Handlebars.registerBoundHelper('formatNumber', Utils.formatNumber);

Ember.Handlebars.registerBoundHelper('formatFileSize', Utils.formatFileSize);

Ember.Handlebars.registerBoundHelper('formatError', Utils.formatError);

Ember.Handlebars.registerBoundHelper('capitalize', Utils.capitalize);

Ember.Handlebars.registerBoundHelper('lowerCase', Utils.toLowerCase);

Ember.Handlebars.registerBoundHelper('titleCase', Utils.toTitleCase);

Ember.Handlebars.registerBoundHelper('modalFieldErrors', function(errorsList) {
	var errors = Utils.formatError(errorsList);
	errors = Ember.Handlebars.Utils.escapeExpression(errors);
	return new Ember.Handlebars.SafeString(
		'<div class="alert alert-error label4b">%@</div>'.fmt(errors)
	);
});

Ember.Handlebars.registerBoundHelper('stringify', function(obj) {
	return new Ember.Handlebars.SafeString(JSON.stringify(obj, null, 4));
});

Ember.Handlebars.registerBoundHelper('humanReadableDate', Utils.humanReadableDate);
Ember.Handlebars.registerBoundHelper('humanReadableTime', Utils.humanReadableTime);
Ember.Handlebars.registerBoundHelper('humanReadableDateShort', Utils.humanReadableDateShort);
Ember.Handlebars.registerBoundHelper('humanReadableDateLong', Utils.humanReadableDateLong);
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
