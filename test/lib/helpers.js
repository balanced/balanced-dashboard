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

		if (options.clickMultiple) {
			clickMultiple(form + ' ' + options.clickMultiple);
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
	assertClick: function(app, selector, assert, message) {
		message = message || "Clickable element " + selector + " exists";

		var isPresent = $(selector).length > 0;
		assert.ok(isPresent, message);
		if (isPresent) {
			click(selector);
		}
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
		var clickCaller = function(number) {
			if (number > 0) {
				return click(clickEl).then(function() {
					clickCaller(number - 1);
				});
			}
		};
		number = number || 10;

		clickCaller(number);
	},
	waitForVisit: function(app, url, cb, err, time) {
		visit(url);

		return waitFor(function() {
			if (cb()) {
				return true;
			}

			visit(url);
			wait();
			return false;
		}, err, time);
	},
	waitFor: function(app, cb, err, time) {
		wait();

		if (err && _.isNumber(err)) {
			time = err;
			err = null;
		}

		// Wait for up to 5 mins
		time = time || 300000;

		var startTime = new Date();
		var runInterval = function() {
			var elapsed = new Date() - startTime;
			if (cb()) {
				Testing.start();
			} else if (elapsed >= time) {
				// If an error message is included
				// then something failed so throw an error
				// otherwise, just start it
				if (err) {
					var error = new Error(err);
					throw error;
				} else {
					Testing.start();
				}
			} else {
				wait();
				setTimeout(runInterval, 100);
			}
		};

		setTimeout(runInterval, 0);
		Ember.Logger.debug('Tests waiting for...');
		return Testing.stop();
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
