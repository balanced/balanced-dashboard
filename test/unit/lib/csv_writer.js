module("Balanced.CsvWriter");

test("#addColumnName", function(assert){
	var subject = new Balanced.CsvWriter();
	assert.deepEqual(subject.columnNames, []);
	subject.addColumnName("id", "customer_id");
	subject.addColumnName("name");

	assert.deepEqual(subject.columnNames, [{
		key: "id",
		label: "customer_id"
	}, {
		key: "name",
		label: "name"
	}]);
});

test("#toCsvString without column names", function (assert) {
	var subject = new Balanced.CsvWriter();
	assert.deepEqual(subject.toCsvString(), "");

	subject.addRow({
		name: "jim",
		animalType: "giraffe",
		description: 'jim is yellow, tall, and "necky"'
	});
	subject.addRow({
		name: "max",
		animalType: "black\nrhino",
		description: 'max is gray and heavy'
	});

	var expectation = 'jim,giraffe,"jim is yellow, tall, and ""necky"""\nmax,"black\nrhino",max is gray and heavy';
	assert.deepEqual(subject.toCsvString(), expectation);
});
