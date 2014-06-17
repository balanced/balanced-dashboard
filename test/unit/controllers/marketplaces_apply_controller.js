module("Balanced.MarketplacesApplyController");

test("#dateYears", function(assert) {
	var subject = Balanced.MarketplacesApplyController.create();
	var dobYears = subject.get("dateYears");
	[1997, 1996, 1992, 1930].forEach(function(year) {
		assert.ok(_.include(dobYears, year));
	});
});

test("#save (valid request)", function(assert) {
	var marketplace = Ember.Object.create({});
	var productionAccessRequest = Ember.Object.create({
		isValid: true,
		save: sinon.stub().returns(Ember.RSVP.resolve(null)),
		validate: sinon.stub()
	});
	var subject = Balanced.MarketplacesApplyController.create();
	subject.set("model", productionAccessRequest);

	subject.send("save");

	assert.ok(productionAccessRequest.validate.calledOnce);
	assert.ok(productionAccessRequest.save.calledOnce);
});

test("#save (invalid request)", function(assert) {
	var productionAccessRequest = Ember.Object.create({
		isValid: false,
		validate: sinon.stub(),
		logValidationErrors: sinon.stub()
	});
	var subject = Balanced.MarketplacesApplyController.create();
	subject.set("model", productionAccessRequest);

	subject.send("save");

	assert.ok(productionAccessRequest.validate.calledOnce, "validate was called");
});
