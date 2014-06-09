module("Balanced.ObjectCreatorModalBaseView");

var createSubject = function(attributes) {
	return Balanced.ObjectCreatorModalBaseView.create(attributes);
};

test("#model", function(assert) {
	var view = createSubject({
		model_class: Ember.Object.extend({
			name: "Cool class"
		})
	});

	assert.equal(view.get("model.name"), "Cool class");
});

test("#submit", function(assert) {
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

	var view = createSubject({
		model: model
	});
	view.send("submit");

	model.set("isValid", true);
	view.send("submit");

	assert.ok(validateStub.calledTwice, "Validate was called");
	assert.ok(saveStub.calledOnce, "Save was called");
	assert.ok(finallyStub.calledOnce, "Finally was called");
});
