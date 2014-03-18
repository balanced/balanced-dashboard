// Create the test namespace
var Balanced = Balanced || {};
Balanced.Test = Balanced.Test || {};

var DEFAULT_FILL_FORM_OPTIONS = {
	attr: 'name'
};

Balanced.Test.asyncHelpers = {
	fillForm: function(app, form, params, options) {
		wait();

		if (form && _.isObject(form)) {
			options = params;
			params = form;
			form = '';
		}

		options = _.extend({}, DEFAULT_FILL_FORM_OPTIONS, options);

		_.each(params, function(val, name) {
			fillIn(form + ' [' + options.attr + '="' + name + '"]', val);

			wait();
		});

		if (options.click) {
			if (_.isArray(options.click)) {
				_.each(options.click, function(val) {
					click(form + ' ' + val);
					wait();
				});
			} else {
				click(form + ' ' + options.click);
			}
		}

		return wait();
	},
	checkElements: function(app, hash, assert) {
		wait();

		_.each(hash, function(val, selector) {
			if (_.isObject(val)) {
				if (val.count) {
					assert.equal($(selector).length, val.count, 'Element exists ' + selector);
				}

				if (val.text) {
					assert.equal($(selector).text().trim(), val, 'Text for ' + selector);
				}

				if (val.html) {
					assert.equal($(selector).html().trim(), val, 'Html for ' + selector);
				}

				if (val.classNames) {
					if (!_.isArray(val.classNames)) {
						val.classNames = [val.classNames];
					}

					_.each(val.classNames, function(key) {
						assert.ok($(selector).hasClass(key), selector + ' has class ' + key);
					});
				}

				if (val.attr) {
					_.each(val.attr, function(attrVal, attrName) {
						assert.equal($(selector).prop(attrName), attrVal, selector + ' has ' + attrName + '=' + attrVal);
					});
				}

				if (val.id) {
					assert.equal($(selector).attr('id'), val.id, selector + ' has id=' + val.id);
				}

				if (val.hasText) {
					assert.ok($(selector).text().trim().length > 0, selector + ' has text');
				}

				if (val.hasChildren) {
					assert.ok($(selector).children().length > 0, selector + ' has children elements');
				}
			} else if (_.isNumber(val)) {
				assert.equal($(selector).length, val, 'Element exists ' + selector + ' ' + val + ' times');
			} else if (_.isString(val)) {
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
	},
	clickMultiple: function(app, clickEl, number) {
		for (number = number || 10; number > 0; number--) {
			click(clickEl);

			wait();
		}

		return wait();
	},
	onUrl: function(app, route, assert) {
		wait();

		assert.equal(Balanced.__container__.lookup('router:main').get('url'), route, 'On correct url');

		return wait();
	}
};

_.each(Balanced.Test.helpers || {}, function(fn, name) {
	Ember.Test.registerHelper(name, fn);
});

_.each(Balanced.Test.asyncHelpers || {}, function(fn, name) {
	Ember.Test.registerAsyncHelper(name, fn);
});
