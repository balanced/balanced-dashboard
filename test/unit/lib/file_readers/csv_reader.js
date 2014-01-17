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

test("hashes", function(assert) {
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

	assert.deepEqual(csvReader.get("hashes"), expectations);
});

test("column_names", function(assert) {
	var csvReader = Balanced.CsvReader.create({
		body: "column1,column2\ncell1:1,cell1:2"
	});

	var columns = csvReader.get("column_names");
	assert.deepEqual(columns, ["column1", "column2"]);
});

test("mapRowToAttributes", function(assert) {
	var reader = Balanced.CsvReader.create();
	var row = {
		"Name": "Reginald",
		"Bank Account": "83938439843"
	};

	var result = reader.mapRowToAttributes(row, {
		name: "Name",
		bank_account: "Bank Account"
	});

	assert.deepEqual(result, {
		name: "Reginald",
		bank_account: "83938439843"
	});
});

test("mapRowsToAttributes", function(assert) {
	var csvRows = [{
		"Name": "Reginald",
		"Bank Account": "83938439843"
	}, {
		"Name": "Ronald"
	}, {
		"Name": "Robert",
		"Bank Account": "99000"
	}];

	var expectations = [{
		name: "Reginald",
		bank_account: "83938439843"
	}, {
		name: "Ronald",
		bank_account: undefined
	}, {
		name: "Robert",
		bank_account: "99000"
	}];
	var reader = Balanced.CsvReader.create({
		rows: csvRows
	});
	var result = reader.mapRowsToAttributes({
		name: "Name",
		bank_account: "Bank Account"
	});

	assert.deepEqual(result, expectations);

});
