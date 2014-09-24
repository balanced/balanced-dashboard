module('Balanced.Modals.MetaEditModalView');

test('save (invalid)', function(assert) {
	var transaction = {};

	var view = Balanced.Modals.MetaEditModalView.open(transaction, [{
		key: "",
		value: "sample value"
	}]);

	var notificationController = {
		alertError: sinon.stub(),
		clearAlerts: sinon.stub()
	};

	var container = {
		lookup: sinon.stub().returns(notificationController)
	};

	view.set('container', container);
	Ember.run(function() {
		view.send('save');
	});

	assert.deepEqual(notificationController.alertError.args, [
		[
			"All keys must be present."
		]
	]);
	assert.equal(notificationController.clearAlerts.args.length, 2);
});

test('save (valid)', function(assert) {
	var transaction = {};

	var view = Balanced.Modals.MetaEditModalView.open(transaction, [{
		key: "sample key",
		value: "sample value"
	}]);

	var notificationController = {
		alertSuccess: sinon.stub(),
		clearAlerts: sinon.stub()
	};

	var container = {
		lookup: sinon.stub().returns(notificationController)
	};

	view.set('container', container);
	Ember.run(function() {
		view.send('save');
	});

	assert.deepEqual(notificationController.alertSuccess.args, []);
	assert.equal(notificationController.clearAlerts.args.length, 2);
});
