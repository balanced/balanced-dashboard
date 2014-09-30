import MetaEditModalView from "balanced-dashboard/views/modals/meta-edit-modal";

module('View - MetaEditModalView');

test('save (invalid)', function() {
	var transaction = {};

	var view = MetaEditModalView.open(transaction, [{
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

	deepEqual(notificationController.alertError.args, [
		[
			"All keys must be present."
		]
	]);
	equal(notificationController.clearAlerts.args.length, 2);
});

test('save (valid)', function() {
	var transaction = {};

	var view = MetaEditModalView.open(transaction, [{
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

	deepEqual(notificationController.alertSuccess.args, []);
	equal(notificationController.clearAlerts.args.length, 2);
});
