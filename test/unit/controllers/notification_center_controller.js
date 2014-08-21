module("Balanced.NotificationCenterController", {
	setup: function() {
		var container = new Ember.Container();
		this.controller = Balanced.NotificationCenterController.create({
			container: container
		});
	},
});

test("#alert", function(assert) {
	var result = this.controller.alert({
		type: "error",
		message: "There's something wrong with your elbow",
		name: "DoctorMessage"
	});

	assert.deepEqual(result.getProperties("type", "message", "name"), {
		type: "error",
		message: "There's something wrong with your elbow",
		name: "DoctorMessage"
	});
});

test("#alertError", function(assert) {
	var result = this.controller.alertError("There's something wrong with your elbow", {
		name: "DoctorMessage"
	});

	assert.deepEqual(result.getProperties("type", "message", "name"), {
		type: "error",
		message: "There's something wrong with your elbow",
		name: "DoctorMessage"
	});
});

test("#alertSuccess", function(assert) {
	var result = this.controller.alertSuccess("There's something right with your elbow", {
		name: "DoctorMessage"
	});

	assert.deepEqual(result.getProperties("type", "message", "name"), {
		type: "success",
		message: "There's something right with your elbow",
		name: "DoctorMessage"
	});
});

test("#expireAlerts", function(assert) {
	var controller = this.controller;
	controller.alertError("Something bad will happen");
	controller.alertError("Something bad happened", {
		expire: true
	});
	controller.alertError("Something bad is happening", {
		expire: true
	});

	assert.deepEqual(controller.get("length"), 3);
	this.controller.expireAlerts();
	assert.deepEqual(controller.get("length"), 1);
});

test("#clearNamedAlert", function(assert) {
	var controller = this.controller;
	controller.alertError("Something bad will happen", {
		name: "Prediction"
	});
	controller.alertError("Something bad is happening");

	assert.deepEqual(controller.get("length"), 2);
	this.controller.clearNamedAlert("Prediction");
	assert.deepEqual(controller.get("length"), 1);
});
