import Utils from 'balanced-dashboard/lib/utils';

export default Ember.Handlebars.registerBoundHelper('modalFieldErrors', function(errorsList) {
	var errors = Utils.formatError(errorsList);
	errors = Ember.Handlebars.Utils.escapeExpression(errors);
	return new Ember.Handlebars.SafeString(
		'<div class="alert alert-error label4b">%@</div>'.fmt(errors)
	);
});


