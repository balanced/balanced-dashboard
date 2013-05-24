module("Balanced.BaseFormView", {
  setup: function() {
    view = Ember.Object.create();

	singleObjectForm = Balanced.BaseFormView.extend({
		formProperties: ['a']
	});

	form = singleObjectForm.create();
	// simulate the named views
	form.set('a', {});
  }
});

test("reset works properly", function () {
	var obj = Ember.Object.create({a: "123"});
	form.reset(obj);

	equal(form.get("a.value"), obj.get("a"));
});

test("updateObject works properly", function () {
	var obj = Ember.Object.create({a: "123"});
	form.updateObjectFromFormFields(obj);

	equal(obj.get("a"), form.get("a.value"));
});

test("highlightErrors works properly", function () {
	form.highlightErrorsFromAPIResponse({description: 'something something a something'});
	equal(form.get("a_error"), true);

	form.highlightErrorsFromAPIResponse({description: 'something something b something'});
	equal(form.get("a_error"), false);
});