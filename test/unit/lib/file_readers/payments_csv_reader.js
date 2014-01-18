module("Balanced.PaymentsCsvReader");

test("totalPayoutBalance", function(assert) {
	var reader = Balanced.PaymentsCsvReader.create({
		body: "name,amount,bank_account\nArthur Bear,100.00,901039782094742\nSpider Man, 192,3928472986492"
	});

	assert.equal(reader.totalPayoutBalance(), 29200);
});

test("totalNumberOfCustomers", function(assert) {
	var reader = Balanced.PaymentsCsvReader.create({
		body: "customer_id,name,amount,bank_account\n101,Arthur Bear,100.00,901039782094742\n101,Arthur Bear, 192,3928472986492\n200,Spider Man,121,209340842842024"
	});

	assert.equal(reader.totalNumberOfCustomers(), 2);
});
