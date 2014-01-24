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
	Ember.run(function() {
		generateSampleFile();
	});
});

function generateSampleFile() {
	Testing.setupMarketplace();
	var headers = [
		'bank_account_id', 'new_customer_name', 'new_customer_email',
		'new_bank_account_routing_number', 'new_bank_account_number',
		'new_bank_account_name', 'new_bank_account_type', 'amount_in_cents',
		'appears_on_statement_as', 'description'
	];
	var payments = [headers];
	var descriptions = [
		'a Partridge in a Pear Tree.',
		'Two Turtle Doves',
		'Three French Hens',
		'4 Calling Birds',
		'5 Gold Rings',
		'6 Geese-a-laying',
		'7 Swans a Swimming',
		'8 Ladies Dancing (Giggity)',
		'9 Maids a milking (also Giggity)',
		'10 Lords a leaping',
		'11 Pipers Piping',
		'12 Drummers Drumming'
	],
		names = [
			'John Foo', 'James Woo', 'Harry Tan', 'Charlie Chan', 'Tommy Tang',
			'Bobby Digital', 'The Rock', 'Harrison Ford', 'Dwyane Braggart'
		],
		emails = [
			'example.org', 'example.com'
		],
		types = [
			'CHECKING', 'SAVINGS'
		];
	var bankAccount = Balanced.BankAccount.create();
	bankAccount.set('routing_number', '121000358');
	bankAccount.set('account_number', '123123123');
	bankAccount.set('name', 'Existing bank account man');
	bankAccount.save();

	payments.push([
		bankAccount.get('id'), null, null,
		null, null,
		null, null, parseInt(Math.random(1, 10) * 100),
		'Payment #' + parseInt(Math.random() * 10000),
		descriptions[Math.floor(Math.random() * descriptions.length)]
	]);

	// create a couple of additional payments to new bank accounts
	for (var i = 0; i < 10; i++) {
		var name = names[Math.floor(Math.random() * names.length)];
		var email = name.toLowerCase().replace(' ', '.') + '@' + emails[Math.floor(Math.random() * emails.length)];
		payments.push([
			null, name, email,
			'121000358', '123123123',
			name, types[Math.floor(Math.random() * types.length)],
			parseInt(Math.random(1, 10) * 100),
			'Payment #' + parseInt(Math.random() * 10000),
			descriptions[Math.floor(Math.random() * descriptions.length)]
		]);
	}
	console.log(payments);
	var csvData = generateCSV(payments);
	console.log(csvData);


	var download = document.createElement('a');
	download.textContent = 'download';
	download.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData));
	download.setAttribute('download', 'example.csv');
	$('html').append(download)

}

// https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
function generateCSV(content) {
	var finalVal = '';

	for (var i = 0; i < content.length; i++) {
		var value = content[i];

		for (var j = 0; j < value.length; j++) {
			var innerValue = (value[j] || '').toString();
			var result = innerValue.replace(/"/g, '""');
			if (result.search(/("|,|\n)/g) >= 0)
				result = '"' + result + '"';
			if (j > 0)
				finalVal += ',';
			finalVal += result;
		}

		finalVal += '\n';
	}
	return finalVal;
}
