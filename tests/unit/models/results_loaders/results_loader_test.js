import ModelArray from "balanced-dashboard/models/core/model-array";
import SearchModelArray from "balanced-dashboard/models/core/search-model-array";
import ResultsLoader from "balanced-dashboard/models/results-loaders/base";
import Testing from "balanced-dashboard/tests/helpers/testing";
import Transaction from "balanced-dashboard/models/transaction";
import Dispute from "balanced-dashboard/models/dispute";
import Invoice from "balanced-dashboard/models/invoice";
import Customer from "balanced-dashboard/models/customer";

module("ResultsLoader", {
	teardown: function() {
		Testing.restoreMethods(
			SearchModelArray.newArrayLoadedFromUri,
			jQuery.ajax,
			ModelArray.create
		);
	},
});

test("#setSortField", function(assert) {
	var subject = ResultsLoader.create();
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
	var subject = ResultsLoader.create({});

	var test = function(expectation) {
		assert.deepEqual(subject.get("resultsUri"), expectation);
	};

	test(undefined);
	subject.set("path", "/marketplaces");
	test("/marketplaces?limit=50&sort=created_at%2Cdesc");
});

test("#results (blank)", function(assert) {
	var subject = ResultsLoader.create({
		resultsUri: ""
	});

	var results = subject.get("results");

	assert.equal(results.get("length"), 0);
	assert.deepEqual(results.get("isLoaded"), true);
});

test("#results", function(assert) {
	var stub = sinon.stub(SearchModelArray, "newArrayLoadedFromUri");
	var result = Ember.Object.create();
	stub.returns(result);

	var subject = ResultsLoader.create({
		resultsType: Transaction,
		resultsUri: "/transactions/cool"
	});

	var r = subject.get("results");

	assert.deepEqual(stub.args, [
		["/transactions/cool", Transaction]
	]);
	assert.deepEqual(result.get("sortProperties"), ["created_at"]);
	assert.deepEqual(result.get("sortAscending"), false);
	assert.equal(r, result);
});

test("#isBulkDownloadCsv", function(assert) {
	var test = function(type, expectation) {
		var subject = ResultsLoader.create({
			resultsType: type,
		});
		assert.deepEqual(subject.isBulkDownloadCsv(), expectation);
	};

	test(Dispute, true);
	test(Transaction, true);
	test(Invoice, true);
	test(Customer, false);
	test(undefined, false);
});

test("#getCsvExportType", function(assert) {
	var test = function(type, expectation) {
		var subject = ResultsLoader.create({
			resultsType: type,
		});
		assert.equal(subject.getCsvExportType(), expectation);
	};

	test(Dispute, "disputes");
	test(Transaction, "transactions");
	test(Invoice, "invoices");
	test(Customer, undefined);
	test(undefined, undefined);
});

test("#postCsvExport (by uri)", function(assert) {
	var stub = sinon.stub(jQuery, "ajax");
	stub.returns({
		then: function() {}
	});

	var subject = ResultsLoader.create({
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

	var subject = ResultsLoader.create({
		resultsType: Transaction,
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
