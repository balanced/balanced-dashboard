import Testing from '../../helpers/testing';
import fixturesAdapter from "../../helpers/fixtures-adapter";
import BaseConnection from "balanced-dashboard/lib/connections/base-connection";
import Rev0Serializer from "balanced-dashboard/serializers/rev0";
import Model from "balanced-dashboard/models/core/model";

var TestModel, App;
var getTestModel = function() {
	return TestModel;
};

module('Model - Model', {
	setup: function() {
		fixturesAdapter.addFixtures([{
			uri: '/v1/testobjects/1',
			basic_field: 123
		}]);

		TestModel = Model.extend({
			basic_field: 1,
			derived_field: function() {
				return this.get('basic_field') + 1;
			}.property('basic_field')
		});

		TestModel.reopenClass({
			serializer: Rev0Serializer.create()
		});
		sinon.stub(TestModel, "getAdapter").returns(fixturesAdapter);
	},
	teardown: function() {
		Testing.restoreMethods(Model.getAdapter);
	},
});

test('model computes embedded properties correctly', function() {
	var t = getTestModel().create();
	equal(t.get('basic_field'), 1);
	equal(t.get('derived_field'), 2);

	t.set('basic_field', 5);
	equal(t.get('basic_field'), 5);
	equal(t.get('derived_field'), 6);
});

test("created models don't share state", function() {
	var t = getTestModel().create();
	t.set('basic_field', 5);

	equal(t.get('basic_field'), 5);
	equal(t.get('derived_field'), 6);

	var s = getTestModel().create();
	s.set('basic_field', 123);

	equal(s.get('basic_field'), 123);
	equal(s.get('derived_field'), 124);

	equal(t.get('basic_field'), 5);
	equal(t.get('derived_field'), 6);
});

test("models have promises that resolve when they're loaded", function() {
	stop();
	getTestModel().find('/v1/testobjects/1')
		.then(function(testModel) {
			equal(testModel.get('basic_field'), 123);
			start();
		});
});

test('models promises resolve async', function() {
	expect(1);

	var t = getTestModel().create();
	Ember.run(function() {
		t.then(function(testModel) {
			equal(testModel.get('basic_field'), 123);
		});

		t.populateFromJsonResponse({
			uri: '/v1/testobjects/1',
			basic_field: 123
		});
	});
});

test('models have promises for create', function() {
	var t = getTestModel().create({
		uri: '/v1/woo'
	});
	stop();

	t.save()
		.then(function(model) {
			ok(true);
		})
		.then(start);
});

test('create promises work if the model was previously invalid', function() {
	stop();
	var spy = sinon.spy();
	var t = getTestModel().create({
		uri: '/v1/woo'
	});

	t
		.then(undefined, function(model) {
			spy(model.uri);
		})
		.then(function() {
			return t.save();
		})
		.then(function(model) {
			spy(model.uri);
		})
		.then(function() {
			deepEqual(spy.args, [["/v1/woo"], ["/v1/woo"]]);
			start();
		});


		t._handleError({
			status: 400,
			responseText: 'Something bad'
		});


});

test('models have promises for update', function() {
	expect(1);
	var t = getTestModel().find('/v1/testobjects/1');

	stop();
	t.save()
		.then(function(model) {
			ok(true);
		})
		.then(start);
});

test('models have promises for delete', function() {
	expect(1);
	var t = getTestModel().find('/v1/testobjects/1');

	stop();
	t.delete()
		.then(function(model) {
			ok(true);
		})
		.then(start);
});

test('newly created models have promises for delete', function() {
	expect(1);
	var t = getTestModel().create({
		uri: '/v1/testobjects/1',
		isLoaded: true
	});

	stop();
	t.delete()
		.then(function(model) {
			ok(true);
		})
		.then(start);
});

test('models have promises for reload', function() {
	expect(1);
	var t = getTestModel().find('/v1/testobjects/1');

	stop();
	t.reload()
		.then(function(model) {
			ok(true);
		})
		.then(start);
});

test('models handles error', function() {
	var t = getTestModel().create();
	t._handleError({
		status: 409,
		responseJSON: {
			errors: [{
				status_code: 409,
				category_code: 'insufficient-funds',
				description: 'You dont have 1000 to withdraw.',
				request_id: 'OHM1234567890',
				myOwn: 123
			}]
		}
	});

	equal(t.get('errorCategoryCode'), 'insufficient-funds', 'Parsed error category code');
	equal(t.get('errorDescription'), 'You dont have $10.00 to withdraw.', 'Parsed error description');
	equal(t.get('requestId'), 'OHM1234567890', 'Parsed error request id');
	equal(t.get('lastError.myOwn'), 123, 'Parsed last error');
});
