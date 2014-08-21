module("Balanced.OwnerCustomerBankAccountController", {
	setup: function() {
		var container = new Ember.Container();
		this.controller = Balanced.OwnerCustomerBankAccountController.create({
			container: container
		});
	},
});

test("#find", function(assert) {
	var stub = sinon.stub(Balanced.BankAccount, "find");

	this.controller.find("/some/uri");
	assert.deepEqual(stub.args, [
		["/some/uri"]
	]);

	stub.restore();
});

test("#link", function(assert) {
	var mp = Balanced.Marketplace.create({
		links: {
			owner_customer: "/customers/123456789"
		}
	});
	var bankAccount = {
		set: sinon.stub(),
		save: sinon.stub()
	};

	this.controller.link(mp, bankAccount);

	assert.deepEqual(bankAccount.set.args, [
		["links.customer", "/customers/123456789"]
	]);
	assert.deepEqual(bankAccount.save.args, [
		[]
	]);
});

test("#verify", function(assert) {
	var bankAccount = Balanced.BankAccount.create({
		bank_account_verifications_uri: "/verifications/12341234"
	});
	var stub = sinon.stub(Balanced.Verification, "create");
	var verificationStub = {
		save: sinon.stub()
	};
	stub.returns(verificationStub);

	this.controller.verify(bankAccount);

	assert.deepEqual(stub.args, [
		[{
			uri: "/verifications/12341234"
		}]
	]);
	assert.deepEqual(verificationStub.save.args, [
		[]
	]);

	stub.restore();
});
