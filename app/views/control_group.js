Balanced.ControlGroupFieldView = Balanced.View.extend({
	tagName: 'div',
	classNames: ['control-group'],
	classNameBindings: ['cssError:error'],
	layoutName: '_control_group_field',
	type: 'text',

	recommendedField: false,

	init: function() {
		var field = this.get('field');
		// this.set('value', Ember.computed.alias('controller.' + field));
		// this.reopenClass({
		// 	value: Ember.computed.alias('controller.' + field)
		// });

		console.log('ran init');
		console.log(field, this, this.get('value'));
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

	// fieldKey: function() {
	// 	return "controller." + this.get('field');
	// },

	value: function() {
		var field = this.get('field');

		console.log('nnn', arguments, field);

		return this.get('controller.content').get(field)
	}.property('field'),

	// value: function() {
	// 	var field = this.get('field');
	// 	var spt = field.split('.');
	// 	if (spt && spt.length > 1) {
	// 		console.log(this.get('controller.content').get('address')[spt[1]]);
	// 	}
	// 	console.log('nnn', field, arguments, this.get('controller.content.' + field), this.get('controller.content'), this, _.keys(this));
	// 	return this.get('controller.content').get(field) || this.get('controller.content').get('address')[spt];
	// }.property(),
	//
	valueChange: function() {
		var field = this.get('field'),
			value = this.get('value');
		// var spt = field.split('.');
		// if (spt && spt.length > 1) {
		// 	console.log(this.get('controller.content').get('address')[spt[1]]);
		//
		// }
			console.log('vvv', field, value, arguments, this.get('controller.content.' + field));
		this.get('controller.content').set(field, value);
	}.observes('value'),

	labelForField: function() {
		var field = this.get('field'),
			prefix = this.get('placeholder') || field;
		return this.error(field, prefix) || this.get('help');
	}.property('controller.validationErrors.length')
});
