module("Balanced.ExistingCustomerCreditCreator");

test("#isExisting", function(assert) {
	var cc = Balanced.ExistingCustomerCreditCreator.create();
	assert.ok(cc.get("isExisting"));
});

test("#credit", function(assert) {
	var bankAccount = Balanced.BankAccount.create({
		credits_uri: "/credits/uri"
	});
	var customer = Balanced.Customer.create({
		name: "Milo Cat"
	});

	var cc = Balanced.ExistingCustomerCreditCreator.create({
		csvFields: {
			existing_customer_name_or_email: "Milo Cat",
			amount: "100",
			appears_on_statement_as: "Balanced #1000"
		}
	});
	assert.deepEqual(cc.get("credit.amount"), 10000);
	assert.deepEqual(cc.get("credit.uri"), "/credits");
	assert.deepEqual(cc.get("customer"), undefined);

	cc.set("bankAccount", bankAccount);
	assert.deepEqual(cc.get("credit.uri"), "/credits/uri");

	cc.set("customer", customer);
	assert.deepEqual(cc.get("credit.customer"), customer);
});

test("#save", function(assert) {
	var cc = Balanced.ExistingCustomerCreditCreator.create({
		csvFields: {
			existing_customer_name_or_email: "Milo Cat",
			amount: "100",
			appears_on_statement_as: "Balanced #1000"
		}
	});

	var credit = cc.get("credit");
	sinon.stub(credit, "save");
	cc.save();
	assert.ok(credit.save.calledOnce);
});

test("existing_customer_name_or_email validation", function(assert) {
	var cc = Balanced.ExistingCustomerCreditCreator.create({
		csvFields: {
			existing_customer_name_or_email: "",
		}
	});

	cc.validate();
	console.log(cc.get("validationErrors"));
	assert.deepEqual(cc.get("validationErrors.csvFields.existing_customer_name_or_email.messages"), ["can't be blank"]);
});
