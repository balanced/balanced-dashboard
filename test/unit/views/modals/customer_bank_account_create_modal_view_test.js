module("Balanced.Modals.CustomerBankAccountCreateModalView");

test("#model", function(assert) {
	var subject = Balanced.Modals.CustomerBankAccountCreateModalView.create();
	assert.equal(subject.get("model.constructor"), Balanced.BankAccount);
});

asyncTest("#save", function(assert) {
	var model = Ember.Object.create({
		tokenizeAndCreate: sinon.stub(),
		route_name: "cool_route"
	});
	model.tokenizeAndCreate.returns(Ember.RSVP.resolve(model));

	var view = Balanced.Modals.CustomerBankAccountCreateModalView.create({
		model: model,
		customer: {
			id: "xxxxxxxxxxxxxxx"
		}
	});
	view.save().then(function() {
		assert.ok(model.tokenizeAndCreate.calledOnce);
		assert.deepEqual(model.tokenizeAndCreate.firstCall.args, ["xxxxxxxxxxxxxxx"]);
		start();
	});
});
