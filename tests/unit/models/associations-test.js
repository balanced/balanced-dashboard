import startApp from "../../helpers/start-app";
import Ember from 'ember';
import Model from "balanced-dashboard/models/core/model";
import Rev0Serializer from "balanced-dashboard/serializers/rev0";
import TypeMappings from "balanced-dashboard/models/core/type-mappings";
import Testing from "balanced-dashboard/tests/helpers/testing";
import fixturesAdapter from "../../helpers/fixtures-adapter";

var rev0Model,
	rev1Model,
	TestFirstChildModel,
	TestSecondChildModel,
	TestModel, Adapter = fixturesAdapter;

var lookupFactory = function(name) {
	return BalancedApp.__container__.lookupFactory('model:' + name);
};

module('Model - Associations', {
	setup: function() {
		var App = startApp({
			ADAPTER: fixturesAdapter
		});

		rev0Model = Model.extend({});
		rev0Model.reopenClass({
			serializer: Rev0Serializer.create()
		});

		rev1Model = Model.extend({});

		TestModel = rev0Model.extend({
			basic_field: 1,
			derived_field: function() {
				return this.get('basic_field') + 1;
			}.property('basic_field')
		});
		Adapter.addFixtures([{
			uri: '/v1/testobjects/1',
			_type: 'test',
			basic_field: 123
		}]);

		TestFirstChildModel = rev0Model.extend({
			child_class_field: function() {
				return 'first';
			}.property()
		});

		TestSecondChildModel = rev0Model.extend({
			child_class_field: function() {
				return 'second';
			}.property()
		});

		BalancedApp.__container__.register('model:test', TestModel);
		BalancedApp.__container__.register('model:test-first-child', TestFirstChildModel);
		BalancedApp.__container__.register('model:test-second-child', TestSecondChildModel);

		TypeMappings.addTypeMapping('test', lookupFactory("test"));
		TypeMappings.addTypeMapping('first', lookupFactory('test-first-child'));
		TypeMappings.addTypeMapping('second', lookupFactory('test-second-child'));
	},

	teardown: function() {}
});

test('belongsTo associations work for embedded objects', function() {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_belongs_to_field', 'test')
	});

	Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_belongs_to_field: {
			_type: 'test',
			basic_field: 234
		}
	}]);

	var t = TestModel2.find('/v1/testmodel2s/2');

	andThen(function() {
		t.get("my_belongs_to_field");
	});

	andThen(function() {
		equal(t.get('my_belongs_to_field.basic_field'), 234);
		equal(t.get('my_belongs_to_field.derived_field'), 235);
	});
});

test('belongsTo associations work for URIs', function() {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_belongs_to_field', 'test')
	});

	Adapter.addFixtures([{
		_type: "test",
		uri: '/v1/testmodel2s/2',
		my_belongs_to_field_uri: '/v1/belongs_to_fields/1'
	}, {
		_type: "test",
		uri: '/v1/belongs_to_fields/1',
		basic_field: 456
	}]);

	var t = TestModel2.find('/v1/testmodel2s/2');

	andThen(function() {
		t.get("my_belongs_to_field");
	});

	andThen(function() {
		t.get("my_belongs_to_field");
	});

	andThen(function() {
		equal(t.get('my_belongs_to_field.basic_field'), 456);
		equal(t.get('my_belongs_to_field.derived_field'), 457);
	});
});

test('hasMany associations work for embedded objects', function() {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_embedded_field', 'test')
	});

	Adapter.addFixtures([{
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

	andThen(function() {
		t.get("my_has_many_field");
	});

	andThen(function() {
		equal(t.get('my_has_many_field').get('length'), 2);
		equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
		equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
	});
});

test('hasMany associations work for URIs', function() {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_embedded_field', 'test')
	});

	Adapter.addFixtures([{
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
	andThen(function() {
		t.get("my_has_many_field");
	});
	andThen(function() {
		t.get("my_has_many_field");
	});
	andThen(function() {
		equal(t.get('my_has_many_field').get('length'), 2);
		equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
		equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
	});
});

test("belongsTo associations don't share state", function() {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_field', "test"),
		my_other_belongs_to_field: Model.belongsTo('my_other_field', "test")
	});

	Adapter.addFixtures([{
		uri: '/v1/testobj/123',
		my_field_uri: '/v1/testobjects/1',
		my_other_field_uri: '/v1/testobjects/2',
	}, {
		uri: '/v1/testobjects/2',
		basic_field: 42
	}]);

	var t = TestModel2.find('/v1/testobj/123');

	andThen(function() {
		t.get("my_belongs_to_field");
		t.get("my_other_belongs_to_field");
	});

	andThen(function() {
		t.get("my_belongs_to_field");
		t.get("my_other_belongs_to_field");
	});

	andThen(function() {
		equal(t.get('my_belongs_to_field.basic_field'), 123);
		equal(t.get('my_belongs_to_field.derived_field'), 124);
		equal(t.get('my_other_belongs_to_field.basic_field'), 42);
		equal(t.get('my_other_belongs_to_field.derived_field'), 43);
	});

	andThen(function() {
		Ember.run(function() {
			t.get('my_belongs_to_field').set('basic_field', 8);
			t.get('my_other_belongs_to_field').set('basic_field', 23);
		});
	});

	andThen(function() {
		equal(t.get('my_belongs_to_field.basic_field'), 8);
		equal(t.get('my_belongs_to_field.derived_field'), 9);
		equal(t.get('my_other_belongs_to_field.basic_field'), 23);
		equal(t.get('my_other_belongs_to_field.derived_field'), 24);
	});
});

test('Embedded belongsTo associations work with fields of the same name', function() {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_belongs_to_field', 'test')
	});

	Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_belongs_to_field: {
			basic_field: 234,
			_type: 'test'
		}
	}]);

	var t = TestModel2.find('/v1/testmodel2s/2');
	andThen(function() {
		t.get("my_belongs_to_field");
	});

	andThen(function() {
		equal(t.get('my_belongs_to_field').get('basic_field'), 234);
		equal(t.get('my_belongs_to_field.basic_field'), 234);

		equal(t.get('my_belongs_to_field').get('derived_field'), 235);
		equal(t.get('my_belongs_to_field.derived_field'), 235);
	});
});

test("hasMany associations don't share state", function() {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field', 'test'),
		my_other_has_many_field: Model.hasMany('my_other_field', 'test')
	});

	Adapter.addFixtures([{
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

	andThen(function() {
		t.get("my_has_many_field");
		t.get("my_other_has_many_field");
	});

	andThen(function() {
		t.get("my_has_many_field");
		t.get("my_other_has_many_field");
	});
	andThen(function() {
		equal(t.get('my_has_many_field').get('length'), 2);
		equal(t.get('my_other_has_many_field').get('length'), 4);
		equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
		equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
		equal(t.get('my_other_has_many_field').objectAt(0).get('derived_field'), 2);
		equal(t.get('my_other_has_many_field').objectAt(1).get('derived_field'), 3);
		equal(t.get('my_other_has_many_field').objectAt(2).get('derived_field'), 4);
		equal(t.get('my_other_has_many_field').objectAt(3).get('derived_field'), 5);
	});
});

test('Embedded hasMany associations work with fields of the same name', function() {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_has_many_field', 'test')
	});

	Adapter.addFixtures([{
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
	andThen(function() {
		t.get("my_has_many_field");
	});

	andThen(function() {
		equal(t.get('my_has_many_field').get('length'), 2);
		equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
		equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
	});
});

test("belongsTo returns undefined if the property hasn't been set yet", function() {
	var TestModel2 = rev0Model.extend({
		my_field_uri: null,
		my_belongs_to_field: Model.belongsTo('my_field_uri', "test")
	});

	var t = TestModel2.create();
	equal(t.get('my_belongs_to_field'), undefined);
	equal(t.get('my_belongs_to_field.basic_field'), undefined);
});

test("embedded belongsTo returns null if the property was null", function() {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field1: Model.belongsTo('my_first_obj', "test")
	});

	Adapter.addFixtures([{
		uri: '/v1/testobjects/0',
		my_first_obj: null
	}]);

	var t = TestModel2.find('/v1/testobjects/0');
	equal(t.get('my_belongs_to_field'), null);
	equal(t.get('my_belongs_to_field.basic_field'), null);
});

test("embedded belongsTo returns undefined if the property was not present", function() {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field1: Model.belongsTo('my_first_obj', "test")
	});

	Adapter.addFixtures([{
		uri: '/v1/testobjects/0'
	}]);

	var t = TestModel2.find('/v1/testobjects/0');
	equal(t.get('my_belongs_to_field'), undefined);
	equal(t.get('my_belongs_to_field.basic_field'), undefined);
});

test("hasMany returns an object even if the property hasn't been set yet", function() {
	var TestModel2 = rev0Model.extend({
		my_field_uri: null,
		my_has_many_field: Model.hasMany('my_field_uri', 'test'),
		my_embedded_has_many_field: Model.hasMany('my_field_uri', 'test')
	});

	var t = TestModel2.create();
	ok(Ember.isArray(t.get('my_has_many_field')));
	ok(Ember.isArray(t.get('my_embedded_has_many_field')));
	equal(t.get('my_has_many_field').get('length'), 0);
	equal(t.get('my_embedded_has_many_field').get('length'), 0);
});

test("belongsTo associations have promises that resolve when they're loaded", function() {
	expect(1);

	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_field', "test")
	});

	Adapter.addFixtures([{
		_uris: {
			my_field_uri: {
				_type: 'test'
			}
		},
		uri: '/v1/testmodel2s/2',
		my_field_uri: '/v1/testobjects/1'
	}]);

	stop();
	var t = TestModel2.find('/v1/testmodel2s/2').then(function(testModel2) {
		return testModel2.get('my_belongs_to_field');
	}).then(function(belongsToModel) {
		equal(belongsToModel.get('basic_field'), 123);
		start();
	});
});

test('belongsTo association promises resolve async', function() {
	expect(2);

	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_field', 'test')
	});

	stop();

	var t = TestModel2.create();
	Ember.run(function() {
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

	andThen(function() {
		t.get('my_belongs_to_field')
			.then(function(belongsToModel) {
				ok(belongsToModel);
				equal(belongsToModel.get('basic_field'), 123);
				start();
			});
	});

});

test("hasMany associations have promises that resolve when they're loaded", function() {
	expect(2);

	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field', 'test')
	});

	Adapter.addFixtures([{
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

	stop();
	Ember.run(function() {
		var t = TestModel2.find('/v1/testmodel2s/2').then(function(testModel2) {
			return testModel2.get('my_has_many_field');
		}).then(function(hasManyArray) {
			equal(hasManyArray.objectAt(0).get('basic_field'), 123);
			equal(hasManyArray.objectAt(1).get('basic_field'), 234);
			start();
		});
	});
});

test('hasMany association promises resolve async', function() {
	expect(4);

	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field_uri', 'test')
	});

	Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_field_uri: '/v1/testobjects/1hasManyResolveAsync'
	}]);

	stop();
	var t = TestModel2.find('/v1/testmodel2s/2');
	t
		.then(function(testModel2) {
			testModel2.get('my_has_many_field').addObject(TestModel.create({
				basic_field: 123
			}));
			testModel2.get('my_has_many_field').addObject(TestModel.create({
				basic_field: 234
			}));
			testModel2.get('my_has_many_field').trigger('didLoad');
			return testModel2.get('my_has_many_field');
		})
		.then(function() {
			var hasManyArray = t.get("my_has_many_field");
			ok(Ember.isArray(hasManyArray));
			equal(hasManyArray.get('length'), 2);
			equal(hasManyArray.objectAt(0).get('basic_field'), 123);
			equal(hasManyArray.objectAt(1).get('basic_field'), 234);
		})
		.finally(function() {
			start();
		});
});

test('hasMany creates correct types for polymorphic associations', function() {
	expect(3);
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field', 'test')
	});

	Adapter.addFixtures([{
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

	stop();
	Ember.run(function() {
		TestModel2.find('/v1/testobjects/10').then(function(testModel) {
			return testModel.get('my_has_many_field');
		}).then(function(hasManyArray) {
			equal(hasManyArray.get('length'), 2);
			equal(hasManyArray.objectAt(0).get('child_class_field'), 'first');
			equal(hasManyArray.objectAt(1).get('child_class_field'), 'second');
			start();
		});
	});
});

test('belongsTo creates correct types for embedded polymorphic associations', function() {
	expect(2);

	var TestModel2 = rev0Model.extend({
		my_belongs_to_field1: Model.belongsTo('my_first_obj', 'test'),
		my_belongs_to_field2: Model.belongsTo('my_second_obj', 'test')
	});

	Adapter.addFixtures([{
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
	stop();

	andThen(function() {
		TestModel2.find('/v1/testobjects/0')
			.then(function(testModel) {
				return testModel.get('my_belongs_to_field1');
			})
			.then(function(belongsToField) {
				equal(belongsToField.get('child_class_field'), 'first');
			});
	});
	andThen(function() {
		TestModel2.find('/v1/testobjects/0')
			.then(function(testModel) {
				return testModel.get('my_belongs_to_field2');
			})
			.then(function(belongsToField) {
				equal(belongsToField.get('child_class_field'), 'second');
				start();
			});
	});
});

test('hasMany pagination works', function() {
	expect(6);
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field', 'test')
	});

	Adapter.addFixtures([{
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

	var testModel = TestModel2.find('/v1/testobjects/10');

	andThen(function() {
		testModel.get('my_has_many_field');
	});
	andThen(function() {
		testModel.get('my_has_many_field');
	});

	andThen(function() {
		var hasManyArray = testModel.get("my_has_many_field");
		equal(hasManyArray.get('length'), 2);
		deepEqual(hasManyArray.get('hasNextPage'), true);
		hasManyArray.loadNextPage();
	});

	andThen(function() {
		var hasManyArray = testModel.get("my_has_many_field");
		equal(hasManyArray.get('length'), 4);
		ok(hasManyArray.get('hasNextPage'));
		hasManyArray.loadNextPage();
	});
	andThen(function() {
		var hasManyArray = testModel.get("my_has_many_field");
		equal(hasManyArray.get('length'), 5);
		ok(!hasManyArray.get('hasNextPage'));
	});
});

test('hasMany collection can be reloaded', function() {
	expect(2);

	var model = rev0Model.extend({
		transactions: Model.hasMany('transactions', 'test')
	});

	Adapter.addFixtures([{
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

	stop();
	Ember.run(function() {
		model.find('/v1/obj')
		.then(function(testModel) {
			return testModel.get('transactions');
		})
		.then(function(transactions) {
			equal(transactions.get('length'), 2);
			return transactions.reload();
		})
		.then(function(transactions) {
			equal(transactions.get('length'), 2);
			start();
		});
	});
});

test('hasMany URIs can be specified in the model object, not just the JSON', function() {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_embedded_field', 'test'),
		my_embedded_field_uri: '/v1/embedded/1'
	});

	Adapter.addFixtures([{
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

	stop();
	var t;
	TestModel2.find('/v1/testmodel2s/2')
		.then(function(o) {
			t = o;
			return o.get("my_has_many_field");
		})
		.then(function(l) {
			equal(t.get('my_has_many_field.length'), 2);
			equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
			equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
			start();
		});
});

test('belongsTo URI associations that are missing the metadata fetch to determine the correct type', function() {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_belongs_to_field', 'test')
	});

	Adapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_belongs_to_field_uri: '/v1/belongs_to_fields/1'
	}, {
		uri: '/v1/belongs_to_fields/1',
		basic_field: 456,
		_type: 'test'
	}]);

	var t = TestModel2.find('/v1/testmodel2s/2');

	andThen(function() {
		t.get("my_belongs_to_field");
	});
	andThen(function() {
		t.get("my_belongs_to_field");
	});
	andThen(function() {
		equal(t.get('my_belongs_to_field.basic_field'), 456);
		equal(t.get('my_belongs_to_field.derived_field'), 457);
	});
});
