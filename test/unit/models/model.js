module('Balanced.Model', {
  setup: function() {
    Balanced.TestModel = Balanced.Model.extend({
		basic_field: 1,
		derived_field: function() {
			return this.get('basic_field') + 1;
		}.property('basic_field')
	});
  },

  teardown: function() {
  }
});

test('model computes embedded properties correctly', function (assert) {
	var t = Balanced.TestModel.create();
	assert.equal(t.get('basic_field'), 1);
	assert.equal(t.get('derived_field'), 2);

	t.set('basic_field', 5);
	assert.equal(t.get('basic_field'), 5);
	assert.equal(t.get('derived_field'), 6);
});

test('belongsTo associations work', function (assert) {
	var TestModel2 = Balanced.Model.extend({
		my_uri_field: '/v1/testobjects/1',
		my_belongs_to_field: Balanced.Model.belongsTo('Balanced.TestModel', 'my_uri_field')
	});

	Balanced.Adapter.addFixtures([
		{
			uri: '/v1/testobjects/1',
			basic_field: 123
		}
	]);

	var t = TestModel2.create();

	assert.equal(t.get('my_belongs_to_field').get('basic_field'), 123);
	assert.equal(t.get('my_belongs_to_field.basic_field'), 123);

	assert.equal(t.get('my_belongs_to_field').get('derived_field'), 124);
	assert.equal(t.get('my_belongs_to_field.derived_field'), 124);
});

test('Embedded belongsTo associations work', function (assert) {
    var TestModel2 = Balanced.Model.extend({
        my_belongs_to_field: Balanced.Model.belongsTo('Balanced.TestModel', 'my_embedded_field', {embedded: true})
    });

    Balanced.Adapter.addFixtures([
        {
        	uri: '/v1/testmodel2s/2',
        	my_embedded_field: {
        		basic_field: 234
        	}
        }
    ]);

    var t = TestModel2.find('/v1/testmodel2s/2');

    assert.equal(t.get('my_belongs_to_field').get('basic_field'), 234);
    assert.equal(t.get('my_belongs_to_field.basic_field'), 234);

    assert.equal(t.get('my_belongs_to_field').get('derived_field'), 235);
    assert.equal(t.get('my_belongs_to_field.derived_field'), 235);
});

test('hasMany associations work', function (assert) {
	var TestModel2 = Balanced.Model.extend({
		my_uri_field: '/v1/testobjects/1',
		my_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_uri_field')
	});

	Balanced.Adapter.addFixtures([
		{
			uri: '/v1/testobjects/1',
			items: [{
				basic_field: 123
			}, {
				basic_field: 234
			}]
		}
	]);

	var t = TestModel2.create();

	assert.equal(t.get('my_has_many_field').get('length'), 2);
	assert.equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
	assert.equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
});

test('Embedded hasMany associations work', function (assert) {
	var TestModel2 = Balanced.Model.extend({
		my_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_embedded_field', {embedded: true})
	});

	Balanced.Adapter.addFixtures([
		{
			uri: '/v1/testmodel2s/2',
        	my_embedded_field: [{
				basic_field: 123
			}, {
				basic_field: 234
			}]
		}
	]);

	var t = TestModel2.find('/v1/testmodel2s/2');

	assert.equal(t.get('my_has_many_field').get('length'), 2);
	assert.equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
	assert.equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
});

test('belongsTo returns an object even if the property hasnt been set yet', function(assert) {
	var TestModel2 = Balanced.Model.extend({
		my_uri_field: null,
		my_belongs_to_field: Balanced.Model.belongsTo('Balanced.TestModel', 'my_uri_field'),
		my_embedded_belongs_to_field: Balanced.Model.belongsTo('Balanced.TestModel', 'my_uri_field')
	});

	var t = TestModel2.create();
	assert.equal(t.get('my_belongs_to_field').get('basic_field'), 1);
	assert.equal(t.get('my_embedded_belongs_to_field').get('basic_field'), 1);
});

test('hasMany returns an object even if the property hasnt been set yet', function(assert) {
	var TestModel2 = Balanced.Model.extend({
		my_uri_field: null,
		my_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_uri_field'),
		my_embedded_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_uri_field')
	});

	var t = TestModel2.create();
	assert.ok(Ember.isArray(t.get('my_has_many_field')));
	assert.ok(Ember.isArray(t.get('my_embedded_has_many_field')));
	assert.equal(t.get('my_has_many_field').get('length'), 0);
	assert.equal(t.get('my_embedded_has_many_field').get('length'), 0);
});

test("models have promises that resolve when they're loaded", function(assert) {
	Balanced.Adapter.addFixtures([
		{
			uri: '/v1/testobjects/1',
			basic_field: 123
		}
	]);

	Ember.run(function() {
		Balanced.TestModel.find('/v1/testobjects/1').then(function(testModel) {
			assert.equal(testModel.get('basic_field'), 123);
		});
	});
});

test("models promises resolve async", function(assert) {
	expect( 1 );

	var t = Balanced.TestModel.create();
	Ember.run(function() {
		t.then(function(testModel) {
			assert.equal(testModel.get('basic_field'), 123);
		});

		t._updateFromJson({
			uri: '/v1/testobjects/1',
			basic_field: 123
		});
		t.trigger('didLoad');
	});
});

test("belongsTo associations have promises that resolve when they're loaded", function(assert) {
	expect( 1 );

	var TestModel2 = Balanced.Model.extend({
		my_belongs_to_field: Balanced.Model.belongsTo('Balanced.TestModel', 'my_uri_field')
	});

	Balanced.Adapter.addFixtures([
		{
			uri: '/v1/testmodel2s/2',
			my_uri_field: '/v1/testobjects/1'
		},
		{
			uri: '/v1/testobjects/1',
			basic_field: 123
		}
	]);

	Ember.run(function() {
		var t = TestModel2.find('/v1/testmodel2s/2').then(function(testModel2) {
			return testModel2.get('my_belongs_to_field');
		}).then(function(belongsToModel) {
			assert.equal(belongsToModel.get('basic_field'), 123);
		});
	});
});

test("belongsTo association promises resolve async", function(assert) {
	expect( 1 );

	var TestModel2 = Balanced.Model.extend({
		my_belongs_to_field: Balanced.Model.belongsTo('Balanced.TestModel', 'my_uri_field')
	});

	Balanced.Adapter.addFixtures([
		{
			uri: '/v1/testobjects/1',
			basic_field: 123
		}
	]);

	var t = TestModel2.create();
	Ember.run(function() {
		t.then(function(testModel2) {
			return testModel2.get('my_belongs_to_field');
		}).then(function(belongsToModel) {
			assert.equal(belongsToModel.get('basic_field'), 123);
		});

		t.set('my_uri_field', '/v1/testobjects/1');
		t.trigger('didLoad');
	});
});

test("hasMany associations have promises that resolve when they're loaded", function(assert) {
	expect( 2 );

	var TestModel2 = Balanced.Model.extend({
		my_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_uri_field')
	});

	Balanced.Adapter.addFixtures([
		{
			uri: '/v1/testmodel2s/2',
			my_uri_field: '/v1/testobjects/1'
		},
		{
			uri: '/v1/testobjects/1',
			items: [{
				basic_field: 123
			}, {
				basic_field: 234
			}]
		}
	]);

	Ember.run(function() {
		var t = TestModel2.find('/v1/testmodel2s/2').then(function(testModel2) {
			return testModel2.get('my_has_many_field');
		}).then(function(hasManyArray) {
			assert.equal(hasManyArray.objectAt(0).get('basic_field'), 123);
			assert.equal(hasManyArray.objectAt(1).get('basic_field'), 234);
		});
	});
});

test("hasMany association promises resolve async", function(assert) {
	expect( 4 );

	var TestModel2 = Balanced.Model.extend({
		my_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_uri_field')
	});

	Balanced.Adapter.addFixtures([
		{
			uri: '/v1/testmodel2s/2',
			my_uri_field: '/v1/testobjects/1hasManyResolveAsync'
		}
	]);

	var t = TestModel2.find('/v1/testmodel2s/2');
	Ember.run(function() {
		t.then(function(testModel2) {
			return testModel2.get('my_has_many_field');
		}).then(function(hasManyArray) {
			assert.ok(Ember.isArray(hasManyArray));
			assert.equal(hasManyArray.get('length'), 2);
			assert.equal(hasManyArray.objectAt(0).get('basic_field'), 123);
			assert.equal(hasManyArray.objectAt(1).get('basic_field'), 234);
		});

		t.get('my_has_many_field').addObject(Balanced.TestModel.create({basic_field: 123}));
		t.get('my_has_many_field').addObject(Balanced.TestModel.create({basic_field: 234}));
		t.get('my_has_many_field').trigger('didLoad');
	});
});