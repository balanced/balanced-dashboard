import Ember from 'ember';
import Model from "balanced-dashboard/models/core/model";
import Rev0Serializer from "balanced-dashboard/serializers/rev0";
import TypeMappings from "balanced-dashboard/models/core/type-mappings";
import Testing from "balanced-dashboard/tests/helpers/testing";

var rev0Model;

var getTestModel = function() {
	return BalancedApp.__container__.lookupFactory('model:test-model');
};

module('Model.Associations', {
	setup: function() {
		Testing.setupFixtures();

		rev0Model = Model.extend({});
		rev0Model.reopenClass({
			serializer: Rev0Serializer.create()
		});

		var TestModel = rev0Model.extend({
			basic_field: 1,
			derived_field: function() {
				return this.get('basic_field') + 1;
			}.property('basic_field')
		});
		BalancedApp.__container__.register('model:test-model');
		TypeMappings.addTypeMapping('test', 'test-model');

		BalancedApp.Adapter.addFixtures([{
			uri: '/v1/testobjects/1',
			_type: 'test',
			basic_field: 123
		}]);

		var TestFirstChildModel = rev0Model.extend({
			child_class_field: function() {
				return 'first';
			}.property()
		});

		var TestSecondChildModel = rev0Model.extend({
			child_class_field: function() {
				return 'second';
			}.property()
		});

		BalancedApp.__container__.register('model:test-first-child-model');
		BalancedApp.__container__.register('model:test-second-child-model');

		TypeMappings.addTypeMapping('first', 'test-first-child-model');
		TypeMappings.addTypeMapping('second', 'test-second-child-model');
	},

	teardown: function() {}
});

test('belongsTo associations work for embedded objects', function(assert) {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_belongs_to_field')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_belongs_to_field: {
			"tests": [{
				_type: 'test',
				basic_field: 234
			}]
		}
	}]);

	var t = TestModel2.find('/v1/testmodel2s/2');

	assert.equal(t.get('my_belongs_to_field.basic_field'), 234);
	assert.equal(t.get('my_belongs_to_field.derived_field'), 235);
});

test('belongsTo associations work for embedded objects of wrong type', function(assert) {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_belongs_to_field')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_belongs_to_field: {
			_type: 'test',
			basic_field: 234
		}
	}]);

	var t = TestModel2.find('/v1/testmodel2s/2');

	assert.equal(t.get('my_belongs_to_field.basic_field'), 234);
	assert.equal(t.get('my_belongs_to_field.derived_field'), 235);
});

test('belongsTo associations work for URIs', function(assert) {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_belongs_to_field')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		_uris: {
			my_belongs_to_field_uri: {
				_type: 'test'
			}
		},
		my_belongs_to_field_uri: '/v1/belongs_to_fields/1'
	}, {
		uri: '/v1/belongs_to_fields/1',
		basic_field: 456
	}]);

	var t = TestModel2.find('/v1/testmodel2s/2');

	assert.equal(t.get('my_belongs_to_field.basic_field'), 456);
	assert.equal(t.get('my_belongs_to_field.derived_field'), 457);
});

test('hasMany associations work for embedded objects', function(assert) {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_embedded_field', 'test-model')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_embedded_field: [{
			_type: "test",
			basic_field: 123
		}, {
			_type: "test",
			basic_field: 234
		}]
	}]);

	var t = TestModel2.find('/v1/testmodel2s/2');

	assert.equal(t.get('my_has_many_field').get('length'), 2);
	assert.equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
	assert.equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
});

test('hasMany associations work for URIs', function(assert) {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_embedded_field', 'test-model')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_embedded_field_uri: '/v1/embedded/1'
	}, {
		uri: '/v1/embedded/1',
		items: [{
			_type: "test",
			basic_field: 123
		}, {
			_type: "test",
			basic_field: 234
		}]
	}]);

	var t = TestModel2.find('/v1/testmodel2s/2');

	assert.equal(t.get('my_has_many_field').get('length'), 2);
	assert.equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
	assert.equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
});

test("belongsTo associations don't share state", function(assert) {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_field'),
		my_other_belongs_to_field: Model.belongsTo('my_other_field')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testobj/123',
		_uris: {
			my_field_uri: {
				_type: 'test'
			},
			my_other_field_uri: {
				_type: 'test'
			}
		},
		my_field_uri: '/v1/testobjects/1',
		my_other_field_uri: '/v1/testobjects/2',
	}, {
		uri: '/v1/testobjects/2',
		_type: 'test',
		basic_field: 42
	}]);

	var t = TestModel2.find('/v1/testobj/123');

	assert.equal(t.get('my_belongs_to_field.basic_field'), 123);
	assert.equal(t.get('my_belongs_to_field.derived_field'), 124);
	assert.equal(t.get('my_other_belongs_to_field.basic_field'), 42);
	assert.equal(t.get('my_other_belongs_to_field.derived_field'), 43);

	t.get('my_belongs_to_field').set('basic_field', 8);
	t.get('my_other_belongs_to_field').set('basic_field', 23);

	assert.equal(t.get('my_belongs_to_field.basic_field'), 8);
	assert.equal(t.get('my_belongs_to_field.derived_field'), 9);
	assert.equal(t.get('my_other_belongs_to_field.basic_field'), 23);
	assert.equal(t.get('my_other_belongs_to_field.derived_field'), 24);
});

test('Embedded belongsTo associations work with fields of the same name', function(assert) {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_belongs_to_field')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_belongs_to_field: {
			basic_field: 234,
			_type: 'test'
		}
	}]);

	var t = TestModel2.find('/v1/testmodel2s/2');

	assert.equal(t.get('my_belongs_to_field').get('basic_field'), 234);
	assert.equal(t.get('my_belongs_to_field.basic_field'), 234);

	assert.equal(t.get('my_belongs_to_field').get('derived_field'), 235);
	assert.equal(t.get('my_belongs_to_field.derived_field'), 235);
});

test("hasMany associations don't share state", function(assert) {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field', 'test-model'),
		my_other_has_many_field: Model.hasMany('my_other_field', 'test-model')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testobj/123',
		my_field_uri: '/v1/testobjects/1',
		my_other_field_uri: '/v1/testobjects/2',
	}, {
		uri: '/v1/testobjects/1',
		items: [{
			_type: "test",
			basic_field: 123
		}, {
			_type: "test",
			basic_field: 234
		}]
	}, {
		uri: '/v1/testobjects/2',
		items: [{
			_type: "test",
			basic_field: 1
		}, {
			_type: "test",
			basic_field: 2
		}, {
			_type: "test",
			basic_field: 3
		}, {
			_type: "test",
			basic_field: 4
		}]
	}]);

	var t = TestModel2.find('/v1/testobj/123');

	assert.equal(t.get('my_has_many_field').get('length'), 2);
	assert.equal(t.get('my_other_has_many_field').get('length'), 4);
	assert.equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
	assert.equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
	assert.equal(t.get('my_other_has_many_field').objectAt(0).get('derived_field'), 2);
	assert.equal(t.get('my_other_has_many_field').objectAt(1).get('derived_field'), 3);
	assert.equal(t.get('my_other_has_many_field').objectAt(2).get('derived_field'), 4);
	assert.equal(t.get('my_other_has_many_field').objectAt(3).get('derived_field'), 5);
});

test('Embedded hasMany associations work with fields of the same name', function(assert) {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_has_many_field', 'test-model')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_has_many_field: [{
			_type: "test",
			basic_field: 123
		}, {
			_type: "test",
			basic_field: 234
		}]
	}]);

	var t = TestModel2.find('/v1/testmodel2s/2');

	assert.equal(t.get('my_has_many_field').get('length'), 2);
	assert.equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
	assert.equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
});

test("belongsTo returns undefined if the property hasn't been set yet", function(assert) {
	var TestModel2 = rev0Model.extend({
		my_field_uri: null,
		my_belongs_to_field: Model.belongsTo('my_field_uri')
	});

	var t = TestModel2.create();
	assert.equal(t.get('my_belongs_to_field'), undefined);
	assert.equal(t.get('my_belongs_to_field.basic_field'), undefined);
});

test("embedded belongsTo returns null if the property was null", function(assert) {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field1: Model.belongsTo('my_first_obj')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testobjects/0',
		my_first_obj: null
	}]);

	var t = TestModel2.find('/v1/testobjects/0');
	assert.equal(t.get('my_belongs_to_field'), null);
	assert.equal(t.get('my_belongs_to_field.basic_field'), null);
});

test("embedded belongsTo returns undefined if the property was not present", function(assert) {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field1: Model.belongsTo('my_first_obj')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testobjects/0'
	}]);

	var t = TestModel2.find('/v1/testobjects/0');
	assert.equal(t.get('my_belongs_to_field'), undefined);
	assert.equal(t.get('my_belongs_to_field.basic_field'), undefined);
});

test("hasMany returns an object even if the property hasn't been set yet", function(assert) {
	var TestModel2 = rev0Model.extend({
		my_field_uri: null,
		my_has_many_field: Model.hasMany('my_field_uri', 'test-model'),
		my_embedded_has_many_field: Model.hasMany('my_field_uri', 'test-model')
	});

	var t = TestModel2.create();
	assert.ok(Ember.isArray(t.get('my_has_many_field')));
	assert.ok(Ember.isArray(t.get('my_embedded_has_many_field')));
	assert.equal(t.get('my_has_many_field').get('length'), 0);
	assert.equal(t.get('my_embedded_has_many_field').get('length'), 0);
});

test("belongsTo associations have promises that resolve when they're loaded", function(assert) {
	expect(1);

	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_field')
	});

	BalancedApp.Adapter.addFixtures([{
		_uris: {
			my_field_uri: {
				_type: 'test'
			}
		},
		uri: '/v1/testmodel2s/2',
		my_field_uri: '/v1/testobjects/1'
	}]);

	Ember.run(function() {
		var t = TestModel2.find('/v1/testmodel2s/2').then(function(testModel2) {
			return testModel2.get('my_belongs_to_field');
		}).then(function(belongsToModel) {
			assert.equal(belongsToModel.get('basic_field'), 123);
		});
	});
});

test('belongsTo association promises resolve async', function(assert) {
	expect(2);

	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_field')
	});

	var t = TestModel2.create();
	Ember.run(function() {
		t.then(function(testModel2) {
			return testModel2.get('my_belongs_to_field');
		}).then(function(belongsToModel) {
			assert.ok(belongsToModel);
			assert.equal(belongsToModel.get('basic_field'), 123);
		});

		t.set('__json', {
			_uris: {
				my_field_uri: {
					_type: 'test'
				}
			},
			my_field_uri: '/v1/testobjects/1'
		});
		t.trigger('didLoad');
	});
});

test("hasMany associations have promises that resolve when they're loaded", function(assert) {
	expect(2);

	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field', 'test-model')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_field_uri: '/v1/testobjects/1'
	}, {
		uri: '/v1/testobjects/1',
		items: [{
			_type: "test",
			basic_field: 123
		}, {
			_type: "test",
			basic_field: 234
		}]
	}]);

	Ember.run(function() {
		var t = TestModel2.find('/v1/testmodel2s/2').then(function(testModel2) {
			return testModel2.get('my_has_many_field');
		}).then(function(hasManyArray) {
			assert.equal(hasManyArray.objectAt(0).get('basic_field'), 123);
			assert.equal(hasManyArray.objectAt(1).get('basic_field'), 234);
		});
	});
});

test('hasMany association promises resolve async', function(assert) {
	expect(4);

	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field_uri', 'test-model')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_field_uri: '/v1/testobjects/1hasManyResolveAsync'
	}]);

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

		t.get('my_has_many_field').addObject(getTestModel().create({
			basic_field: 123
		}));
		t.get('my_has_many_field').addObject(getTestModel().create({
			basic_field: 234
		}));
		t.get('my_has_many_field').trigger('didLoad');
	});
});

test('hasMany creates correct types for polymorphic associations', function(assert) {
	expect(3);
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field', 'test-model')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testobjects/10',
		my_field_uri: '/v1/testobjects/1'
	}, {
		uri: '/v1/testobjects/1',
		items: [{
			basic_field: 123,
			_type: 'first'
		}, {
			basic_field: 234,
			_type: 'second'
		}]
	}]);

	Ember.run(function() {
		TestModel2.find('/v1/testobjects/10').then(function(testModel) {
			return testModel.get('my_has_many_field');
		}).then(function(hasManyArray) {
			assert.equal(hasManyArray.get('length'), 2);
			assert.equal(hasManyArray.objectAt(0).get('child_class_field'), 'first');
			assert.equal(hasManyArray.objectAt(1).get('child_class_field'), 'second');
		});
	});
});

test('belongsTo creates correct types for embedded polymorphic associations', function(assert) {
	expect(2);

	var TestModel2 = rev0Model.extend({
		my_belongs_to_field1: Model.belongsTo('my_first_obj'),
		my_belongs_to_field2: Model.belongsTo('my_second_obj')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testobjects/0',
		my_first_obj: {
			uri: '/v1/testobjects/1',
			basic_field: 123,
			_type: 'first'
		},
		my_second_obj: {
			uri: '/v1/testobjects/2',
			basic_field: 123,
			_type: 'second'
		}
	}]);

	var t = TestModel2.find('/v1/testobjects/0');

	Ember.run(function() {
		TestModel2.find('/v1/testobjects/0').then(function(testModel) {
			return testModel.get('my_belongs_to_field1');
		}).then(function(belongsToField) {
			assert.equal(belongsToField.get('child_class_field'), 'first');
		});

		TestModel2.find('/v1/testobjects/0').then(function(testModel) {
			return testModel.get('my_belongs_to_field2');
		}).then(function(belongsToField) {
			assert.equal(belongsToField.get('child_class_field'), 'second');
		});
	});
});

test('hasMany pagination works', function(assert) {
	expect(6);
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field', 'test-model')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testobjects/10',
		my_field_uri: '/v1/testobjects/1'
	}, {
		uri: '/v1/testobjects/1',
		items: [{
			basic_field: 123,
			_type: 'first'
		}, {
			basic_field: 234,
			_type: 'second'
		}],
		next_uri: '/v1/testobjects/1?page=2'
	}, {
		uri: '/v1/testobjects/1?page=2',
		items: [{
			basic_field: 123,
			_type: 'first'
		}, {
			basic_field: 234,
			_type: 'second'
		}],
		next_uri: '/v1/testobjects/1?page=3'
	}, {
		uri: '/v1/testobjects/1?page=3',
		items: [{
			basic_field: 123,
			_type: 'first'
		}],
		next_uri: null
	}]);

	Ember.run(function() {
		TestModel2.find('/v1/testobjects/10').then(function(testModel) {
			return testModel.get('my_has_many_field');
		}).then(function(hasManyArray) {
			assert.equal(hasManyArray.get('length'), 2);
			assert.ok(hasManyArray.get('hasNextPage'));

			return hasManyArray.loadNextPage();
		}).then(function(hasManyArray) {
			assert.equal(hasManyArray.get('length'), 4);
			assert.ok(hasManyArray.get('hasNextPage'));

			return hasManyArray.loadNextPage();
		}).then(function(hasManyArray) {
			assert.equal(hasManyArray.get('length'), 5);
			assert.ok(!hasManyArray.get('hasNextPage'));
		});
	});
});

test('hasMany collection can be reloaded', function(assert) {
	expect(2);

	var model = rev0Model.extend({
		transactions: Model.hasMany('transactions', 'test-model')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/transactions',
		transactions_uri: '/v1/transactions',
		items: [{
			_type: 'test'
		}, {
			_type: 'test'
		}]
	}, {
		uri: '/v1/obj',
		transactions_uri: '/v1/transactions'
	}]);

	Ember.run(function() {
		model.find('/v1/obj').then(function(testModel) {
			return testModel.get('transactions');
		}).then(function(transactions) {
			assert.equal(transactions.get('length'), 2);
			transactions.reload().then(function(transactions) {
				assert.equal(transactions.get('length'), 2);
			});
		});
	});
});

test('hasMany URIs can be specified in the model object, not just the JSON', function(assert) {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_embedded_field', 'test-model'),
		my_embedded_field_uri: '/v1/embedded/1'
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2'
	}, {
		uri: '/v1/embedded/1',
		items: [{
			_type: "test",
			basic_field: 123
		}, {
			_type: "test",
			basic_field: 234
		}]
	}]);

	var t = TestModel2.find('/v1/testmodel2s/2');

	assert.equal(t.get('my_has_many_field').get('length'), 2);
	assert.equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
	assert.equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
});

test('belongsTo URI associations that are missing the metadata fetch to determine the correct type', function(assert) {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_belongs_to_field', 'test-model')
	});

	BalancedApp.Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_belongs_to_field_uri: '/v1/belongs_to_fields/1'
	}, {
		uri: '/v1/belongs_to_fields/1',
		basic_field: 456,
		_type: 'test'
	}]);

	BalancedApp.Adapter.asyncCallbacks = true;

	var t;
	wait().then(function() {
		t = TestModel2.find('/v1/testmodel2s/2');
		return wait();
	}).then(function() {
		t.get('my_belongs_to_field');
		return wait();
	}).then(function() {
		assert.equal(t.get('my_belongs_to_field.basic_field'), 456);
		assert.equal(t.get('my_belongs_to_field.derived_field'), 457);
	});
});
