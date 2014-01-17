module("Balanced.CsvReader");

test("rows", function(assert) {
	var csvReader = Balanced.CsvReader.create({
		body: "column 1,column 2\ncell1:1,cell1:2"
	});
	var rows = csvReader.get("rows");
	assert.equal(rows.length, 2);
	assert.equal(rows[0][0], "column 1");
	assert.equal(rows[0][1], "column 2");
	assert.equal(rows[1][0], "cell1:1");
	assert.equal(rows[1][1], "cell1:2");
});

test("hashes", function(assert) {
	var csvReader = Balanced.CsvReader.create({
		body: "column1,column2\ncell1:1,cell1:2"
	});

	var hashes = csvReader.get("hashes");
	assert.equal(hashes.length, 1);
	assert.equal(hashes[0].column1, "cell1:1");
	assert.equal(hashes[0].column2, "cell1:2");
});
