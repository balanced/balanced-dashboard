import startApp from "../../helpers/start-app";
import Ember from 'ember';
import Model from "balanced-dashboard/models/core/model";
import Rev0Serializer from "balanced-dashboard/serializers/rev0";
import TypeMappings from "balanced-dashboard/models/core/type-mappings";
import Testing from "balanced-dashboard/tests/helpers/testing";
import fixturesAdapter from "../../helpers/fixtures-adapter";

var rev0Model;

var getTestModel = function() {
	return BalancedApp.__container__.lookupFactory('model:test-model');
};

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

		var TestModel = rev0Model.extend({
			basic_field: 1,
			derived_field: function() {
				return this.get('basic_field') + 1;
			}.property('basic_field')
		});

		var Company = rev0Model.extend({
			age: function() {
				return 2014 - this.get("year_founded");
			}.property("year_founded")
		});

		fixturesAdapter.addFixtures([{
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

		BalancedApp.__container__.register('model:company', Company);
		BalancedApp.__container__.register('model:test-model', TestModel);
		BalancedApp.__container__.register('model:test-first-child-model', TestFirstChildModel);
		BalancedApp.__container__.register('model:test-second-child-model', TestSecondChildModel);

		TypeMappings.addTypeMapping('company', lookupFactory("company"));
		TypeMappings.addTypeMapping('test', lookupFactory("test-model"));
		TypeMappings.addTypeMapping('first', lookupFactory('test-first-child-model'));
		TypeMappings.addTypeMapping('second', lookupFactory('test-second-child-model'));
	},

	teardown: function() {}
});

test('belongsTo associations work for embedded objects', function() {
	var User = rev0Model.extend({
		company: Model.belongsTo('company', 'company')
	});

	fixturesAdapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		company: {
			year_founded: 1990
		}
	}]);

	var t = User.find('/v1/testmodel2s/2');
	andThen(function() {
		t.get("company");
	});
	andThen(function() {
		equal(t.get('company.year_founded'), 1990);
		equal(t.get('company.age'), 24);
	});
});

test('belongsTo associations work for embedded objects of wrong type', function() {
	var User = rev0Model.extend({
		company: Model.belongsTo('company', 'company')
	});

	fixturesAdapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		company: {
			_type: "some-type",
			year_founded: 1999
		}
	}]);

	var t = User.find('/v1/testmodel2s/2');
	andThen(function() {
		t.get("company");
	});
	andThen(function() {
		equal(t.get('company.year_founded'), 1999);
		equal(t.get('company.age'), 15);
	});
});

test('belongsTo associations work for URIs', function() {
	var User = rev0Model.extend({
		company: Model.belongsTo('company', 'company')
	});

	fixturesAdapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		company_uri: '/v1/belongs_to_fields/1',
		_uris: {
			company_uri: {
				_type: 'company'
			}
		},
	}, {
		uri: '/v1/belongs_to_fields/1',
		year_founded: 1994
	}]);

	var t = User.find('/v1/testmodel2s/2');
	andThen(function() {
		t.get("company");
		console.log(t.get("company"), t.get("company.year_founded"));
	});
	andThen(function() {
		console.log(t.get("company"), t.get("company.year_founded"));
		equal(t.get('company.year_founded'), 1994);
		equal(t.get('company.age'), 20);
	});
});

test('hasMany associations work for embedded objects', function() {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_embedded_field', 'test-model')
	});

	fixturesAdapter.addFixtures([{
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

	equal(t.get('my_has_many_field').get('length'), 2);
	equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
	equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
});

test('hasMany associations work for URIs', function() {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_embedded_field', 'test-model')
	});

	fixturesAdapter.addFixtures([{
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

	equal(t.get('my_has_many_field').get('length'), 2);
	equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
	equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
});

test("belongsTo associations don't share state", function() {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_field'),
		my_other_belongs_to_field: Model.belongsTo('my_other_field')
	});

	fixturesAdapter.addFixtures([{
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

	equal(t.get('my_belongs_to_field.basic_field'), 123);
	equal(t.get('my_belongs_to_field.derived_field'), 124);
	equal(t.get('my_other_belongs_to_field.basic_field'), 42);
	equal(t.get('my_other_belongs_to_field.derived_field'), 43);

	t.get('my_belongs_to_field').set('basic_field', 8);
	t.get('my_other_belongs_to_field').set('basic_field', 23);

	equal(t.get('my_belongs_to_field.basic_field'), 8);
	equal(t.get('my_belongs_to_field.derived_field'), 9);
	equal(t.get('my_other_belongs_to_field.basic_field'), 23);
	equal(t.get('my_other_belongs_to_field.derived_field'), 24);
});

test('Embedded belongsTo associations work with fields of the same name', function() {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_belongs_to_field')
	});

	fixturesAdapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_belongs_to_field: {
			basic_field: 234,
			_type: 'test'
		}
	}]);

	var t = TestModel2.find('/v1/testmodel2s/2');

	equal(t.get('my_belongs_to_field').get('basic_field'), 234);
	equal(t.get('my_belongs_to_field.basic_field'), 234);

	equal(t.get('my_belongs_to_field').get('derived_field'), 235);
	equal(t.get('my_belongs_to_field.derived_field'), 235);
});

test("hasMany associations don't share state", function() {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field', 'test-model'),
		my_other_has_many_field: Model.hasMany('my_other_field', 'test-model')
	});

	fixturesAdapter.addFixtures([{
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

	equal(t.get('my_has_many_field').get('length'), 2);
	equal(t.get('my_other_has_many_field').get('length'), 4);
	equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
	equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
	equal(t.get('my_other_has_many_field').objectAt(0).get('derived_field'), 2);
	equal(t.get('my_other_has_many_field').objectAt(1).get('derived_field'), 3);
	equal(t.get('my_other_has_many_field').objectAt(2).get('derived_field'), 4);
	equal(t.get('my_other_has_many_field').objectAt(3).get('derived_field'), 5);
});

test('Embedded hasMany associations work with fields of the same name', function() {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_has_many_field', 'test-model')
	});

	fixturesAdapter.addFixtures([{
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

	equal(t.get('my_has_many_field').get('length'), 2);
	equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
	equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
});

test("belongsTo returns undefined if the property hasn't been set yet", function() {
	var TestModel2 = rev0Model.extend({
		my_field_uri: null,
		my_belongs_to_field: Model.belongsTo('my_field_uri')
	});

	var t = TestModel2.create();
	equal(t.get('my_belongs_to_field'), undefined);
	equal(t.get('my_belongs_to_field.basic_field'), undefined);
});

test("embedded belongsTo returns null if the property was null", function() {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field1: Model.belongsTo('my_first_obj', 'first')
	});

	fixturesAdapter.addFixtures([{
		uri: '/v1/testobjects/0',
		my_first_obj: null
	}]);

	var t = TestModel2.find('/v1/testobjects/0');
	equal(t.get('my_belongs_to_field'), null);
	equal(t.get('my_belongs_to_field.basic_field'), null);
});

test("embedded belongsTo returns undefined if the property was not present", function() {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field1: Model.belongsTo('my_first_obj', 'first')
	});

	fixturesAdapter.addFixtures([{
		uri: '/v1/testobjects/0'
	}]);

	var t = TestModel2.find('/v1/testobjects/0');
	equal(t.get('my_belongs_to_field'), undefined);
	equal(t.get('my_belongs_to_field.basic_field'), undefined);
});

test("hasMany returns an object even if the property hasn't been set yet", function() {
	var TestModel2 = rev0Model.extend({
		my_field_uri: null,
		my_has_many_field: Model.hasMany('my_field_uri', 'test-model'),
		my_embedded_has_many_field: Model.hasMany('my_field_uri', 'test-model')
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
		my_belongs_to_field: Model.belongsTo('my_field')
	});

	fixturesAdapter.addFixtures([{
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
			equal(belongsToModel.get('basic_field'), 123);
		});
	});
});

test('belongsTo association promises resolve async', function() {
	expect(2);

	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_field')
	});

	var t = TestModel2.create();
	Ember.run(function() {
		t.then(function(testModel2) {
			return testModel2.get('my_belongs_to_field');
		}).then(function(belongsToModel) {
			ok(belongsToModel);
			equal(belongsToModel.get('basic_field'), 123);
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

test("hasMany associations have promises that resolve when they're loaded", function() {
	expect(2);

	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field', 'test-model')
	});

	fixturesAdapter.addFixtures([{
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
			equal(hasManyArray.objectAt(0).get('basic_field'), 123);
			equal(hasManyArray.objectAt(1).get('basic_field'), 234);
		});
	});
});

test('hasMany association promises resolve async', function() {
	expect(4);

	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field_uri', 'test-model')
	});

	fixturesAdapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_field_uri: '/v1/testobjects/1hasManyResolveAsync'
	}]);

	var t = TestModel2.find('/v1/testmodel2s/2');
	Ember.run(function() {
		t.then(function(testModel2) {
			return testModel2.get('my_has_many_field');
		}).then(function(hasManyArray) {
			ok(Ember.isArray(hasManyArray));
			equal(hasManyArray.get('length'), 2);
			equal(hasManyArray.objectAt(0).get('basic_field'), 123);
			equal(hasManyArray.objectAt(1).get('basic_field'), 234);
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

test('hasMany creates correct types for polymorphic associations', function() {
	expect(3);
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field', 'test-model')
	});

	fixturesAdapter.addFixtures([{
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
			equal(hasManyArray.get('length'), 2);
			equal(hasManyArray.objectAt(0).get('child_class_field'), 'first');
			equal(hasManyArray.objectAt(1).get('child_class_field'), 'second');
		});
	});
});

test('belongsTo creates correct types for embedded polymorphic associations', function() {
	expect(2);

	var TestModel2 = rev0Model.extend({
		my_belongs_to_field1: Model.belongsTo('my_first_obj'),
		my_belongs_to_field2: Model.belongsTo('my_second_obj')
	});

	fixturesAdapter.addFixtures([{
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
			equal(belongsToField.get('child_class_field'), 'first');
		});

		TestModel2.find('/v1/testobjects/0').then(function(testModel) {
			return testModel.get('my_belongs_to_field2');
		}).then(function(belongsToField) {
			equal(belongsToField.get('child_class_field'), 'second');
		});
	});
});

test('hasMany pagination works', function() {
	expect(6);
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_field', 'test-model')
	});

	fixturesAdapter.addFixtures([{
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
			equal(hasManyArray.get('length'), 2);
			ok(hasManyArray.get('hasNextPage'));

			return hasManyArray.loadNextPage();
		}).then(function(hasManyArray) {
			equal(hasManyArray.get('length'), 4);
			ok(hasManyArray.get('hasNextPage'));

			return hasManyArray.loadNextPage();
		}).then(function(hasManyArray) {
			equal(hasManyArray.get('length'), 5);
			ok(!hasManyArray.get('hasNextPage'));
		});
	});
});

test('hasMany collection can be reloaded', function() {
	expect(2);

	var model = rev0Model.extend({
		transactions: Model.hasMany('transactions', 'test-model')
	});

	fixturesAdapter.addFixtures([{
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
			equal(transactions.get('length'), 2);
			transactions.reload().then(function(transactions) {
				equal(transactions.get('length'), 2);
			});
		});
	});
});

test('hasMany URIs can be specified in the model object, not just the JSON', function() {
	var TestModel2 = rev0Model.extend({
		my_has_many_field: Model.hasMany('my_embedded_field', 'test-model'),
		my_embedded_field_uri: '/v1/embedded/1'
	});

	fixturesAdapter.addFixtures([{
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

	equal(t.get('my_has_many_field').get('length'), 2);
	equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
	equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
});

test('belongsTo URI associations that are missing the metadata fetch to determine the correct type', function() {
	var TestModel2 = rev0Model.extend({
		my_belongs_to_field: Model.belongsTo('my_belongs_to_field', 'test-model')
	});

	fixturesAdapter.addFixtures([{
		uri: '/v1/testmodel2s/2',
		my_belongs_to_field_uri: '/v1/belongs_to_fields/1'
	}, {
		uri: '/v1/belongs_to_fields/1',
		basic_field: 456,
		_type: 'test'
	}]);

	fixturesAdapter.asyncCallbacks = true;

	var t;
	wait().then(function() {
		t = TestModel2.find('/v1/testmodel2s/2');
		return wait();
	}).then(function() {
		t.get('my_belongs_to_field');
		return wait();
	}).then(function() {
		equal(t.get('my_belongs_to_field.basic_field'), 456);
		equal(t.get('my_belongs_to_field.derived_field'), 457);
	});
});
