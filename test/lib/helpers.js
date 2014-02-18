// Create the test namespace
var Balanced = Balanced || {};
Balanced.Test = Balanced.Test || {};

var DEFAULT_FILL_FORM_OPTIONS = {
	attr: 'name'
};

Balanced.Test.asyncHelpers = {
	fillForm: function(app, form, params, options) {
		options = _.extend({}, DEFAULT_FILL_FORM_OPTIONS, options);

		_.each(params, function(val, name) {
			fillIn(form + ' [' + options.attr + '=' + name + ']', val);
		});

		if (options.click) {
			click(form + ' ' + options.click);
		}

		return wait();
	},
	checkElements: function(app, hash, assert) {
		_.each(hash, function(val, selector) {
			if (_.isNumber(val)) {
				assert.equal($(selector).length, val, 'Element exists ' + selector);
			} else {
				assert.equal($(selector).text().trim(), val, 'Text for ' + selector);
			}
		});

		return wait();
	},
	submitForm: function(app, form) {
		var formEl = find(form);

		var $form = $(formEl);
		if (!$form.length) {
			throw new Error('Element ' + form + ' not found.');
		}

		$form.submit();

		return wait();
	}
};

_.each(Balanced.Test.helpers || {}, function(fn, name) {
	Ember.Test.registerHelper(name, fn);
});

_.each(Balanced.Test.asyncHelpers || {}, function(fn, name) {
	// TODO: Switch to registerAsyncHelper when we upgrade to emberjs v1.2
	Ember.Test.registerHelper(name, fn);
});
