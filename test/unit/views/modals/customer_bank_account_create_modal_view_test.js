module("Balanced.Modals.CustomerBankAccountCreateModalView");

test("#model", function(assert) {
	var subject = Balanced.Modals.CustomerBankAccountCreateModalView.create();
	assert.equal(subject.get("model.constructor"), Balanced.BankAccount);
});

test("#save invalid", function(assert) {
	var view = Balanced.Modals.CustomerBankAccountCreateModalView.create();
	view.get("model").setProperties({
		account_number: "xxxxxxx",
		routing_number: "xxxxxxx",
	});

	view.send("save");
	var errors = view.get("model.validationErrors");
	assert.deepEqual(errors, {
		"name": "Invalid field [name] - Missing field \"name\"",
		"routing_number": "Invalid field [routing_number] - \"xxxxxxx\" is not a valid routing number"
	});
});

test("#save", function(assert) {
	var model = Ember.Object.create({
		tokenizeAndCreate: sinon.stub(),
		route_name: "cool_route"
	});
	model.tokenizeAndCreate.returns(Ember.RSVP.resolve(model));
	var controller = {
		transitionToRoute: sinon.stub()
	};

	var view = Balanced.Modals.CustomerBankAccountCreateModalView.create({
		model: model,
		controller: controller,
		customer: {
			id: "xxxxxxxxxxxxxxx"
		}
	});
	view.send("save");
	assert.ok(model.tokenizeAndCreate.calledOnce);
	assert.deepEqual(model.tokenizeAndCreate.firstCall.args, ["xxxxxxxxxxxxxxx"]);
});
