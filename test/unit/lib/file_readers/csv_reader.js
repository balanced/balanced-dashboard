module("Balanced.CsvReader");

test("getParsedColumnNames", function(assert) {
	var values = [
		"bank_account",
		"bank_account.id",
		"bank_account.credit.id"
	];

	var expectations = [
		["bank_account"],
		["bank_account", "id"],
		["bank_account", "credit", "id"]
	];

	var reader = Balanced.CsvReader.create({
		body: values.join(",")
	});
	assert.deepEqual(reader.getParsedColumnNames(), expectations);

});

test("getObjects", function(assert) {
	var csv = [
		"bank_account.id,credit.amount,credit.appears_on_statement_as,credit.description",
		"cool id,10.00,COH 01-2014,January Payment User 1"
	].join("\n");

	var reader = Balanced.CsvReader.create({
		body: csv
	});

	var objects = reader.getObjects();
	assert.deepEqual(objects, [{
		"bank_account.id": "cool id",
		"credit.amount": "10.00",
		"credit.appears_on_statement_as": "COH 01-2014",
		"credit.description": "January Payment User 1",
	}]);
});

test("rows", function(assert) {
	var csvReader = Balanced.CsvReader.create({
		body: "animal,name\ncat,milo\ndog,fido"
	});
	var expectations = [
		["animal", "name"],
		["cat", "milo"],
		["dog", "fido"]
	];
	assert.deepEqual(csvReader.get("rows"), expectations);
});

test("fields", function(assert) {
	var csvReader = Balanced.CsvReader.create({
		body: "animal,name\ncat,milo\ndog,fido"
	});
	var expectations = [
		["cat", "milo"],
		["dog", "fido"]
	];
	assert.deepEqual(csvReader.get("fields"), expectations);
});

test("getColumnNames", function(assert) {
	var csvReader = Balanced.CsvReader.create({
		body: "column1,column2\ncell1:1,cell1:2"
	});

	var columns = csvReader.getColumnNames();
	assert.deepEqual(columns, ["column1", "column2"]);
});
