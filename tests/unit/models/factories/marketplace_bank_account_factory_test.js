import MarketplaceBankAccountFactory from "balanced-dashboard/models/factories/marketplace-bank-account-factory";

module("MarketplaceBankAccountFactory");

test("#getPostAttributes", function(assert) {
	var subject = MarketplaceBankAccountFactory.create({
		name: "Monopoly Guy",
		account_type: "savings",
		routing_number: "123123123",
		account_number: "123123123"
	});

	assert.deepEqual(subject.getPostAttributes(), {
		name: "Monopoly Guy",
		account_type: "savings",
		routing_number: "123123123",
		account_number: "123123123"
	});
});

test("#_save", function(assert) {
	var stub = sinon.stub(balanced.bankAccount, "create");

	var subject = MarketplaceBankAccountFactory.create({
		name: "Monopoly Guy",
		account_type: "savings",
		routing_number: "123123123",
		account_number: "123123123"
	});

	subject._save();

	assert.deepEqual(stub.args[0][0], {
		name: "Monopoly Guy",
		account_type: "savings",
		routing_number: "123123123",
		account_number: "123123123"
	});
});
