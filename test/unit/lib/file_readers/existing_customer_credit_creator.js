module("Balanced.ExistingCustomerCreditCreator", {
	setup: function() {
		Testing.setupMarketplace();
	}
});

test("#isExistingBankAccount", function(assert) {
	var cc = Balanced.ExistingCustomerCreditCreator.create({})
	assert.ok(cc.isExistingBankAccount());
});

test("#customer", function(assert) {
	var customer = Balanced.Customer.create({
		email: "cool.customer@example.com"
	});
	assert.ok(false);
});
