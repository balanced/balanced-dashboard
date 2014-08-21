module("Balanced.BankAccountVerificationMessage");

asyncTest("#forMarketplace (test or no customer)", function(assert) {
	var subject = Balanced.BankAccountVerificationMessage;
	var mp = Ember.Object.create({
		production: false,
		owner_customer_uri: "/owner/customer"
	});

	subject.forMarketplace(mp)
		.then(function(result) {
			assert.deepEqual(result, undefined);
		})
		.then(function() {
			mp = Ember.Object.create({
				production: true,
				owner_customer_uri: ""
			});
			return subject.forMarketplace(mp);
		})
		.then(function(result) {
			assert.deepEqual(result, undefined);
		})
		.then(start);
});

asyncTest("#forMarketplace", function(assert) {
	var subject = Balanced.BankAccountVerificationMessage;
	var stub = sinon.stub(Balanced.Customer, "find");
	stub.returns(Ember.RSVP.resolve(Ember.Object.create()));

	var arrayStub = sinon.stub(Balanced.ModelArray, "newArrayLoadedFromUri");
	arrayStub.returns(Ember.RSVP.resolve([]));

	var mp = Ember.Object.create({
		production: true,
		owner_customer_uri: "/owner/customer"
	});

	subject.forMarketplace(mp)
		.then(function(result) {
			assert.deepEqual(stub.args, [
				["/owner/customer"]
			]);
		})
		.then(function() {
			arrayStub.restore();
			stub.restore();
			start();
		});
});

asyncTest("#forCustomer", function(assert) {
	var arrayStub = sinon.stub(Balanced.ModelArray, "newArrayLoadedFromUri");
	arrayStub.returns(Ember.RSVP.resolve([]));
	var customer = Ember.Object.create({
		bank_accounts_uri: "/bank_accounts/yes"
	});

	var subject = Balanced.BankAccountVerificationMessage;
	subject.forCustomer(customer)
		.then(function(result) {
			assert.deepEqual(result, subject.MESSAGES.noBankAccounts);
			assert.deepEqual(arrayStub.args, [
				["/bank_accounts/yes", Balanced.BankAccount]
			]);
		})
		.then(function() {
			arrayStub.restore();
			start();
		});

});

asyncTest("#forBankAccounts", function(assert) {
	var subject = Balanced.BankAccountVerificationMessage;
	var stub = sinon.stub(subject, "loadAllBankAccountsVerifications");
	stub.returns(Ember.RSVP.resolve([]));

	var accounts = [Ember.Object.create({
		can_debit: false
	})];

	subject
		.forBankAccounts([])
		.then(function(message) {
			assert.equal(message, subject.MESSAGES.noBankAccounts);
		})
		.then(function() {
			return subject.forBankAccounts([Ember.Object.create({
				can_debit: true
			})]);
		})
		.then(function(message) {
			assert.equal(message, undefined);
		})
		.then(function() {
			subject.forBankAccounts(accounts);
			assert.deepEqual(stub.args[0], [accounts]);
		})
		.then(function() {
			stub.restore();
		})
		.then(start);
});

asyncTest("#forVerifications", function(assert) {
	var verifiable = Ember.Object.create({
		isVerifiable: true
	});
	var unverifiable = Ember.Object.create({
		isVerifiable: false
	});

	var subject = Balanced.BankAccountVerificationMessage;

	subject
		.forVerifications([
			unverifiable,
			verifiable,
			verifiable
		])
		.then(function(message) {
			assert.equal(message, subject.MESSAGES.openVerification);
		})
		.then(function() {
			return subject.forVerifications([
				unverifiable,
				unverifiable
			]);
		})
		.then(function(message) {
			assert.equal(message, subject.MESSAGES.noOpenVerification);
		})
		.then(start);
});

asyncTest("#loadAllBankAccountsVerifications", function(assert) {
	var stub = sinon.stub(Balanced.Verification, "find");
	stub.returns(Ember.RSVP.resolve("/verifications/loaded"));
	var bankAccounts = [Ember.Object.create({}), Ember.Object.create({
		bank_account_verification_uri: "/verification/1"
	}), Ember.Object.create({
		bank_account_verification_uri: "/verification/4"
	})];
	var subject = Balanced.BankAccountVerificationMessage;
	subject.loadAllBankAccountsVerifications(bankAccounts)
		.then(function(verifications) {
			assert.deepEqual(verifications, [
				"/verifications/loaded",
				"/verifications/loaded",
			]);
			assert.deepEqual(stub.args, [
				["/verification/1"],
				["/verification/4"]
			]);
		})
		.then(function() {
			stub.restore();
			start();
		});

});
