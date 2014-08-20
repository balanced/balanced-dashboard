module("Balanced.BankAccountVerificationMessage");

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
