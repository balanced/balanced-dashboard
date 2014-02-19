// Create the test namespace
var Balanced = Balanced || {};
Balanced.Test = Balanced.Test || {};

var DEFAULT_FILL_FORM_OPTIONS = {
	attr: 'name'
};

Balanced.Test.asyncHelpers = {
	fillForm: function(app, form, params, options) {
		wait();

		options = _.extend({}, DEFAULT_FILL_FORM_OPTIONS, options);

		_.each(params, function(val, name) {
			fillIn(form + ' [' + options.attr + '="' + name + '"]', val);
			wait();
		});

		if (options.click) {
			click(form + ' ' + options.click);
		}

		return wait();
	},
	checkElements: function(app, hash, assert) {
		wait();

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
		wait();

		var formEl = find(form);

		var $form = $(formEl) || $(form);
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
	Ember.Test.registerAsyncHelper(name, fn);
});
