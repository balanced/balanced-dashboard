import Testing from "./testing";

// Create the test namespace
var Balanced = {
	Test: {}
};

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

	testEditTransaction: function(app, transaction) {
		var spy = sinon.spy(BalancedApp.Adapter, "update");
		return click(".side-panel .edit-model-link")
			.fillIn('#edit-description .modal-body input[name=description]', "changing desc")
			.click('#edit-description .modal-footer button[name=modal-submit]')
			.then(function() {
				var firstCall = spy.getCall(0);
				ok(spy.calledOnce);
				equal(firstCall.args[0], transaction.constructor);
				equal(firstCall.args[1], transaction.get("uri"));
				equal(firstCall.args[2].description, "changing desc");
				Testing.restoreMethods(BalancedApp.Adapter.update);
			});
	},

	assertDictionaryExists: function(app, baseDl, dictionary) {
		var dl = $(baseDl);

		_.each(dictionary, function(value, label) {
			var labelElement = dl.find("dt:contains(%@)".fmt(label));
			var valueElement = labelElement.nextAll("dd:first");
			equal($.trim(labelElement.text()), label, "%@ contains dt with text \"%@\"".fmt("baseDl", label));
			equal($.trim(valueElement.text()), value, "%@ contains dd with text \"%@\"".fmt("baseDl", value));
		});
		return;
	},

	assertClick: function(app, selector, message) {
		message = message || "Clickable element " + selector + " exists";

		var isPresent = $(selector).length > 0;
		ok(isPresent, message);
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
		andThen(function() {
			stop();
			var clickCaller = function(number) {
				if (number > 0) {
					$(clickEl).click();
					clickCaller(number - 1);
				}
				else {
					start();
				}
			};
			number = number || 10;
			clickCaller(number);
		});
	},
	onUrl: function(app, route) {
		wait();

		equal(BalancedApp.__container__.lookup('router:main').get('url'), route, 'On correct url');

		return wait();
	}
};

_.each(Balanced.Test.asyncHelpers || {}, function(fn, name) {
	Ember.Test.registerAsyncHelper(name, fn);
});

export default {};
