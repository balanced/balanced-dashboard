var form;

module('Balanced.BaseFormView', {
    setup: function () {
        var singleObjectForm = Balanced.BaseFormView.extend({
            formProperties: ['a']
        });

        form = singleObjectForm.create();
        // simulate the named views
        form.set('a', {});
    }
});

test('reset works properly', function (assert) {
    var obj = Ember.Object.create({a: '123'});
    form.reset(obj);

    assert.equal(form.get('a.value'), obj.get('a'));
});

test('updateObject works properly', function (assert) {
    var obj = Ember.Object.create({a: '123'});
    form.updateObjectFromFormFields(obj);

    assert.equal(obj.get('a'), form.get('a.value'));
});

test('highlightErrors works properly', function (assert) {
    form.highlightErrorsFromAPIResponse({
        description: 'something something a something'
    });
    assert.equal(form.get('a_error'), true,
        'Errors not present when they should be.');

    form.highlightErrorsFromAPIResponse({
        description: 'something something b something'
    });
    assert.equal(form.get('a_error'), false,
        'Errors present when they shouldn\'t be.');
});
test('highlightErrors works with string data', function (assert) {
    form.highlightErrorsFromAPIResponse('{ "description": "something something a something" }');
    assert.equal(form.get('a_error'), true,
        'Errors not present when they should be.');
});
