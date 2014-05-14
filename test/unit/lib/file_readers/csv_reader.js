module("Balanced.CsvReader");

test("getObjects", function(assert) {
	var csv = [
		"amount,appears_on_statement_as,description",
		"10.00,COH 01-2014,January Payment User 1"
	].join("\n");

	var reader = Balanced.CsvReader.create({
		body: csv
	});

	var objects = reader.getObjects();
	assert.deepEqual(objects, [{
		"amount": "10.00",
		"appears_on_statement_as": "COH 01-2014",
		"description": "January Payment User 1",
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
