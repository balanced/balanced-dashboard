Balanced.ControlGroupFieldView = Balanced.View.extend({
	tagName: 'div',
	classNames: ['control-group'],
	classNameBindings: ['cssError:error'],
	layoutName: '_control_group_field',
	type: 'text',

	recommendedField: false,

	init: function() {
		console.log('initing', this.get('field'), this.get('controller.content.' + this.get('field')), this.get('controller'), this.get('controller.content'));
		this.set('value', this.get('controller.content.' + this.get('field')));

		Ember.bind(this, 'value', 'controller.content.' + this.get('field'));
		this._super();
	},

	error: function(field, prefix) {
		var errors = this.get('controller.validationErrors.' + field + '.messages');
		if (errors) {
			var error = errors[0];
			if (error.indexOf(prefix) !== 0) {
				error = prefix + ' ' + error;
			}
			return error;
		}
	},

	cssError: function() {
		var field = this.get('field');
		return this.get('controller.validationErrors.' + field);
	}.property('controller.validationErrors.length'),

	// value: function() {
	// 	var field = this.get('field');
	// 	console.log('nnn', field, arguments);
	// 	return this.get('controller.content.' + field);
	// }.property(),

	// valueChange: function() {
	// 	var field = this.get('field'),
	// 		value = this.get('value');
	// 		console.log('vvv', field, value, arguments);
	// 	this.get('controller.content').set(field, value);
	// }.observes('value'),

	labelForField: function() {
		var field = this.get('field'),
			prefix = this.get('placeholder') || field;
		return this.error(field, prefix) || this.get('help');
	}.property('controller.validationErrors.length')
});
