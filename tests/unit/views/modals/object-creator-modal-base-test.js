import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("view:modals/object-creator-modal-base", "View - ObjectCreatorModalBase");

test("#model", function() {
	var view = this.subject({
		model_class: Ember.Object.extend({
			name: "Cool class"
		})
	});

	equal(view.get("model.name"), "Cool class");
});

test("#submit", function() {
	var validateStub = sinon.stub();
	var finallyStub = sinon.stub();
	var saveStub = sinon.stub().returns({
		then: function() {
			return {
				finally: finallyStub
			};
		}
	});

	var model = Ember.Object.create({
		isValid: false,
		validate: validateStub,
		save: saveStub
	});

	var view = this.subject({
		model: model
	});
	view.send("submit");

	model.set("isValid", true);
	view.send("submit");

	ok(validateStub.calledTwice, "Validate was called");
	ok(saveStub.calledOnce, "Save was called");
	ok(finallyStub.calledOnce, "Finally was called");
});
