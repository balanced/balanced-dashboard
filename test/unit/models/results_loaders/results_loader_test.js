module("Balanced.ResultsLoader", {
	teardown: function() {
		Testing.restoreMethods(
			Balanced.SearchModelArray.newArrayLoadedFromUri,
			jQuery.ajax,
			Balanced.ModelArray.create
		);
	},
});

test("#setSortField", function(assert) {
	var subject = Balanced.ResultsLoader.create();
	var test = function(expectation) {
		assert.deepEqual(subject.get("sort"), expectation);
	};

	test("created_at,desc");
	subject.setSortField("created_at");
	test("created_at,asc");
	subject.setSortField("initiated_at");
	test("initiated_at,desc");
});

test("#resultsUri", function(assert) {
	var subject = Balanced.ResultsLoader.create({});

	var test = function(expectation) {
		assert.deepEqual(subject.get("resultsUri"), expectation);
	};

	test(undefined);
	subject.set("path", "/marketplaces");
	test("/marketplaces?limit=50&sort=created_at%2Cdesc");
});

test("#results (blank)", function(assert) {
	var subject = Balanced.ResultsLoader.create({
		resultsUri: ""
	});

	var results = subject.get("results");

	assert.equal(results.get("length"), 0);
	assert.deepEqual(results.get("isLoaded"), true);
});

test("#results", function(assert) {
	var stub = sinon.stub(Balanced.SearchModelArray, "newArrayLoadedFromUri");
	var result = Ember.Object.create();
	stub.returns(result);

	var subject = Balanced.ResultsLoader.create({
		resultsType: Balanced.Transaction,
		resultsUri: "/transactions/cool"
	});

	var r = subject.get("results");

	assert.deepEqual(stub.args, [
		["/transactions/cool", Balanced.Transaction]
	]);
	assert.deepEqual(result.get("sortProperties"), ["created_at"]);
	assert.deepEqual(result.get("sortAscending"), false);
	assert.equal(r, result);
});

test("#isBulkDownloadCsv", function(assert) {
	var test = function(type, expectation) {
		var subject = Balanced.ResultsLoader.create({
			resultsType: type,
		});
		assert.deepEqual(subject.isBulkDownloadCsv(), expectation);
	};

	test(Balanced.Dispute, true);
	test(Balanced.Transaction, true);
	test(Balanced.Invoice, true);
	test(Balanced.Customer, false);
	test(undefined, false);
});

test("#getCsvExportType", function(assert) {
	var test = function(type, expectation) {
		var subject = Balanced.ResultsLoader.create({
			resultsType: type,
		});
		assert.equal(subject.getCsvExportType(), expectation);
	};

	test(Balanced.Dispute, "disputes");
	test(Balanced.Transaction, "transactions");
	test(Balanced.Invoice, "invoices");
	test(Balanced.Customer, undefined);
	test(undefined, undefined);
});

test("#postCsvExport (by uri)", function(assert) {
	var stub = sinon.stub(jQuery, "ajax");
	stub.returns({
		then: function() {}
	});

	var subject = Balanced.ResultsLoader.create({
		resultsUri: "/transactions"
	});
	subject.postCsvExport("jim@example.org");

	assert.deepEqual(JSON.parse(stub.args[0][0].data), {
		email_address: "jim@example.org",
		uri: "/v1/transactions"
	});
});

test("#postCsvExport (bulk)", function(assert) {
	var stub = sinon.stub(jQuery, "ajax");
	stub.returns({
		then: function() {}
	});

	var subject = Balanced.ResultsLoader.create({
		resultsType: Balanced.Transaction,
		resultsUri: "/transactions",
		startTime: moment("2013-02-08 09:30:26 Z").toDate(),
		endTime: moment("2013-02-08 10:30:26 Z").toDate(),
	});
	subject.postCsvExport("jim@example.org");

	assert.deepEqual(JSON.parse(stub.args[0][0].data), {
		beginning: "2013-02-08T09:30:26.000Z",
		email_address: "jim@example.org",
		ending: "2013-02-08T10:30:26.000Z",
		type: "transactions"
	});
});
