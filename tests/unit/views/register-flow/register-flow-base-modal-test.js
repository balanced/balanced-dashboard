import { test, moduleFor } from 'ember-qunit';
moduleFor("view:register-flow/register-flow-base-modal", "View - RegisterFlowBaseModal");

test("#openConfirmCloseModal", function() {
	var modalsController = {
		open: sinon.stub()
	};
	var modalView = {};
	var sendStub = sinon.stub();
	var applicationController = Ember.Object.extend({
		send: sendStub
	});

	this.container.register("controller:modals_container", modalsController);
	this.container.register("view:register-flow/confirm-close-registration-modal", modalView);
	this.container.register("controller:application", applicationController);

	var modal = this.subject({
		confirmMessage: "A cool confirm message"
	});

	modal.openConfirmCloseModal();

	var modalProps = {
		confirmMessage: "A cool confirm message",
		previousModal: modal
	};

	deepEqual(sendStub.args, [ ["openModal", modalView, modalProps] ]);
});

test("#getNotificationController", function() {
	var Controller = Ember.Object.extend({
		message: "this is the right controller"
	});
	var container = new Ember.Container();
	container.register('controller:notification_center', Controller);
	var modal = this.subject({
		container: container
	});

	equal(modal.getNotificationController().get("message"), "this is the right controller");
});

test("#getModalNotificationController", function() {
	var Controller = Ember.Object.extend({
		message: "this is the modal notification controller"
	});
	var container = new Ember.Container();
	container.register('controller:modal_notification_center', Controller);
	var modal = this.subject({
		container: container
	});

	equal(modal.getModalNotificationController().get("message"), "this is the modal notification controller");
});
