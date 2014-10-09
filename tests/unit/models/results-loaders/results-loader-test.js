import BaseConnection from "balanced-dashboard/lib/connections/base-connection";
import ModelArray from "balanced-dashboard/models/core/model-array";
import Model from "balanced-dashboard/models/core/model";
import SearchModelArray from "balanced-dashboard/models/core/search-model-array";
import ResultsLoader from "balanced-dashboard/models/results-loaders/base";
import Testing from "balanced-dashboard/tests/helpers/testing";
import Transaction from "balanced-dashboard/models/transaction";
import Dispute from "balanced-dashboard/models/dispute";
import Invoice from "balanced-dashboard/models/invoice";
import Customer from "balanced-dashboard/models/customer";
import Download from "balanced-dashboard/models/download";

var Adapter;

module("ResultsLoader - ResultsLoader", {
	setup: function() {
		Adapter = {
			create: sinon.stub()
		};
		sinon.stub(Download, "getAdapter").returns(Adapter);
	},
	teardown: function() {
		Testing.restoreMethods(
			Download.getAdapter,
			SearchModelArray.newArrayLoadedFromUri,
			jQuery.ajax,
			ModelArray.create
		);
	},
});

test("#setSortField", function() {
	var subject = ResultsLoader.create();
	var test = function(expectation) {
		deepEqual(subject.get("sort"), expectation);
	};

	test("created_at,desc");
	subject.setSortField("created_at");
	test("created_at,asc");
	subject.setSortField("initiated_at");
	test("initiated_at,desc");
});

test("#resultsUri", function() {
	var subject = ResultsLoader.create({});

	var test = function(expectation) {
		deepEqual(subject.get("resultsUri"), expectation);
	};

	test(undefined);
	subject.set("path", "/marketplaces");
	test("/marketplaces?limit=50&sort=created_at%2Cdesc");
});

test("#results (blank)", function() {
	var subject = ResultsLoader.create({
		resultsUri: ""
	});

	var results = subject.get("results");

	equal(results.get("length"), 0);
	deepEqual(results.get("isLoaded"), true);
});

test("#results", function() {
	var stub = sinon.stub(SearchModelArray, "newArrayLoadedFromUri");
	var result = Ember.Object.create();
	stub.returns(result);

	var subject = ResultsLoader.create({
		resultsType: Transaction,
		resultsUri: "/transactions/cool"
	});

	var r = subject.get("results");

	deepEqual(stub.args, [
		["/transactions/cool", Transaction]
	]);
	deepEqual(result.get("sortProperties"), ["created_at"]);
	deepEqual(result.get("sortAscending"), false);
	equal(r, result);
});

test("#isBulkDownloadCsv", function() {
	var test = function(type, expectation) {
		var subject = ResultsLoader.create({
			resultsType: type,
		});
		deepEqual(subject.isBulkDownloadCsv(), expectation);
	};

	test(Dispute, true);
	test(Transaction, true);
	test(Invoice, true);
	test(Customer, false);
	test(undefined, false);
});

test("#getCsvExportType", function() {
	var test = function(type, expectation) {
		var subject = ResultsLoader.create({
			resultsType: type,
		});
		equal(subject.getCsvExportType(), expectation);
	};

	test(Dispute, "disputes");
	test(Transaction, "transactions");
	test(Invoice, "invoices");
	test(Customer, undefined);
	test(undefined, undefined);
});

test("#postCsvExport (by uri)", function() {
	var stub = Adapter.create;

	var subject = ResultsLoader.create({
		container: {
			lookupFactory: sinon.stub().returns(Download)
		},
		resultsUri: "/transactions"
	});
	subject.postCsvExport("jim@example.org");
	deepEqual(stub.args[0][1], "/downloads");
	deepEqual(stub.args[0][2], {
		email_address: "jim@example.org",
		uri: "/v1/transactions"
	});
});

test("#postCsvExport (bulk)", function() {
	var stub = Adapter.create;

	var subject = ResultsLoader.create({
		resultsType: Transaction,
		resultsUri: "/transactions",
		startTime: moment("2013-02-08 09:30:26 Z").toDate(),
		endTime: moment("2013-02-08 10:30:26 Z").toDate(),
		container: {
			lookupFactory: sinon.stub().returns(Download)
		},
	});
	subject.postCsvExport("jim@example.org");

	deepEqual(stub.args[0][1], "/downloads");
	deepEqual(stub.args[0][2], {
		beginning: "2013-02-08T09:30:26.000Z",
		email_address: "jim@example.org",
		ending: "2013-02-08T10:30:26.000Z",
		type: "transactions"
	});
});
