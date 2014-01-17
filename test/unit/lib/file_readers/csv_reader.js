module("Balanced.CsvReader");

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

test("column_names", function(assert) {
	var csvReader = Balanced.CsvReader.create({
		body: "column1,column2\ncell1:1,cell1:2"
	});

	var columns = csvReader.get("column_names");
	assert.deepEqual(columns, ["column1", "column2"]);
});

test("getObjects", function(assert) {
	var csvReader = Balanced.CsvReader.create({
		body: "name,amount\nJim Fish,10.00\nDoctor Grump,11.00"
	});
	var expectations = [{
		name: "Jim Fish",
		amount: "10.00"
	}, {
		name: "Doctor Grump",
		amount: "11.00"
	}];

	assert.deepEqual(csvReader.getObjects(), expectations);

	csvReader = Balanced.CsvReader.create({
		body: "User Name,Payment Amount\nJim Fish,10.00\nDoctor Grump,11.00"
	});
	assert.deepEqual(csvReader.getObjects({
	    "User Name": "name",
		"Payment Amount": "amount"
	}), expectations);
});

test("columnsMatch", function (assert) {
	var csvReader = Balanced.CsvReader.create({
		body: "column1,column2\ncell1:1,cell1:2"
	});
	assert.ok(csvReader.columnsMatch(["column1", "column2"]));
	assert.ok(!csvReader.columnsMatch(["column1", "column2kjb"]));
	assert.ok(csvReader.columnsMatch(["column1", "column1"]));
});
