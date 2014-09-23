import { test, moduleFor } from 'ember-qunit';
moduleFor("view:register-flow/register-flow-base-modal", "View - RegisterFlowBaseModal");

test("#openConfirmCloseModal", function(assert) {
	var modalsController = Balanced.__container__.lookup("controller:modals_container");
	var openModalStub = sinon.stub(modalsController, "open");
	var modal = this.subject({
		confirmMessage: "A cool confirm message"
	});

	modal.openConfirmCloseModal();

	var modalClass = Balanced.ConfirmCloseRegistrationModalView;
	var modalProps = {
		confirmMessage: "A cool confirm message",
		previousModal: modal
	};

	assert.deepEqual(openModalStub.args, [
		[modalClass, [modalProps]]
	]);
});

test("#getNotificationController", function(assert) {
	var Controller = Ember.Object.extend({
		message: "this is the right controller"
	});
	var container = new Ember.Container();
	container.register('controller:notification_center', Controller);
	var modal = this.subject({
		container: container
	});

	assert.equal(modal.getNotificationController().get("message"), "this is the right controller");
});

test("#getModalNotificationController", function(assert) {
	var Controller = Ember.Object.extend({
		message: "this is the modal notification controller"
	});
	var container = new Ember.Container();
	container.register('controller:modal_notification_center', Controller);
	var modal = this.subject({
		container: container
	});

	assert.equal(modal.getModalNotificationController().get("message"), "this is the modal notification controller");
});
