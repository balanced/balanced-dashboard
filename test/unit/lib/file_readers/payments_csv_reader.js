module("Balanced.PaymentsCsvReader");

test("valid_columns", function(assert) {
	var validBody = "customer_id,bank_account_id,amount,bank_statement_descriptor,internal_description\n1,BA19ibxV5MPQPbds6Nhpjm47,10.00,COHITRE 01-2014,January Payment User 1";

	var csvReader = Balanced.PaymentsCsvReader.create({
		body: validBody
	});

	assert.ok(csvReader.get("valid_columns"));
	csvReader.set("column_names", ["column1", "column2"]);
	assert.ok(!csvReader.get("valid_columns"));
	csvReader.set("column_names", csvReader.expected_columns);
	assert.ok(csvReader.get("valid_columns"));
});

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
