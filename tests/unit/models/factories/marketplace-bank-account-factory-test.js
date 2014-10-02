import MarketplaceBankAccountFactory from "balanced-dashboard/models/factories/marketplace-bank-account-factory";

module("Factory - MarketplaceBankAccountFactory");

test("#getPostAttributes", function() {
	var subject = MarketplaceBankAccountFactory.create({
		name: "Monopoly Guy",
		account_type: "savings",
		routing_number: "123123123",
		account_number: "123123123"
	});

	deepEqual(subject.getPostAttributes(), {
		name: "Monopoly Guy",
		account_type: "savings",
		routing_number: "123123123",
		account_number: "123123123"
	});
});

test("#_save", function() {
	var stub = sinon.stub(balanced.bankAccount, "create");

	var subject = MarketplaceBankAccountFactory.create({
		name: "Monopoly Guy",
		account_type: "savings",
		routing_number: "123123123",
		account_number: "123123123"
	});

	subject._save();

	deepEqual(stub.args[0][0], {
		name: "Monopoly Guy",
		account_type: "savings",
		routing_number: "123123123",
		account_number: "123123123"
	});
});
