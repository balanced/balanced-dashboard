module('Balanced.Model', {
	setup: function() {
		Balanced.TEST.setupFixtures();
		Balanced.TestModel = Balanced.Model.extend({
			basic_field: 1,
			derived_field: function() {
				return this.get('basic_field') + 1;
			}.property('basic_field')
		});

		Balanced.TestModel.reopenClass({
			serializer: Balanced.Rev0Serializer.create()
		});

		Balanced.Adapter.addFixtures([{
			uri: '/v1/testobjects/1',
			basic_field: 123
		}]);
	},

	teardown: function() {}
});

test('model computes embedded properties correctly', function(assert) {
	var t = Balanced.TestModel.create();
	assert.equal(t.get('basic_field'), 1);
	assert.equal(t.get('derived_field'), 2);

	t.set('basic_field', 5);
	assert.equal(t.get('basic_field'), 5);
	assert.equal(t.get('derived_field'), 6);
});

test("created models don't share state", function(assert) {
	var t = Balanced.TestModel.create();
	t.set('basic_field', 5);
	assert.equal(t.get('basic_field'), 5);
	assert.equal(t.get('derived_field'), 6);

	var s = Balanced.TestModel.create();
	s.set('basic_field', 123);
	assert.equal(s.get('basic_field'), 123);
	assert.equal(s.get('derived_field'), 124);
	assert.equal(t.get('basic_field'), 5);
	assert.equal(t.get('derived_field'), 6);
});

test("models have promises that resolve when they're loaded", function(assert) {
	Ember.run(function() {
		Balanced.TestModel.find('/v1/testobjects/1').then(function(testModel) {
			assert.equal(testModel.get('basic_field'), 123);
		});
	});
});

test('models promises resolve async', function(assert) {
	expect(1);

	var t = Balanced.TestModel.create();
	Ember.run(function() {
		t.then(function(testModel) {
			assert.equal(testModel.get('basic_field'), 123);
		});

		t.populateFromJsonResponse({
			uri: '/v1/testobjects/1',
			basic_field: 123
		});
	});
});

test('models have promises for create', function(assert) {
	expect(1);
	var t = Balanced.TestModel.create({
		uri: '/v1/woo'
	});
	Ember.run(function() {
		t.save().then(function(model) {
			assert.ok(true);
		});
	});
});

test('create promises work if the model was previously invalid', function(assert) {
	expect(1);
	var t = Balanced.TestModel.create({
		uri: '/v1/woo'
	});

	t._handleError({
		status: 400,
		responseText: 'Something bad'
	});

	Ember.run(function() {
		t.save().then(function(model) {
			assert.ok(true);
		});
	});
});

test('models have promises for update', function(assert) {
	expect(1);
	var t = Balanced.TestModel.find('/v1/testobjects/1');
	Ember.run(function() {
		t.save().then(function(model) {
			assert.ok(true);
		});
	});
});

test('models have promises for delete', function(assert) {
	expect(1);
	var t = Balanced.TestModel.find('/v1/testobjects/1');
	Ember.run(function() {
		t.delete().then(function(model) {
			assert.ok(true);
		});
	});
});

test('newly created models have promises for delete', function(assert) {
	expect(1);
	var t = Balanced.TestModel.create({
		uri: '/v1/testobjects/1',
		isLoaded: true
	});
	Ember.run(function() {
		t.delete().then(function(model) {
			assert.ok(true);
		});
	});
});

test('models have promises for reload', function(assert) {
	expect(1);
	var t = Balanced.TestModel.find('/v1/testobjects/1');
	Ember.run(function() {
		t.reload().then(function(model) {
			assert.ok(true);
		});
	});
});
