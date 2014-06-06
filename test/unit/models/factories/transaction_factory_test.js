module("Balanced.TransactionFactory");

test("#amount", function(assert) {
	var subject = Balanced.TransactionFactory.create();
	subject.set("dollar_amount", "10.00");
	assert.deepEqual(subject.get("amount"), "1000");

	subject.set("dollar_amount", "vrnvr");
	assert.deepEqual(subject.get("amount"), undefined);

	subject.set("dollar_amount", 100);
	assert.deepEqual(subject.get("amount"), "100");
});
