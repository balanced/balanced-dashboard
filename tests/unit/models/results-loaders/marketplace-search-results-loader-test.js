import SearchModelArray from "balanced-dashboard/models/core/search-model-array";
import MarketplaceSearchResultsLoader from "balanced-dashboard/models/results-loaders/marketplace-search";
import Customer from "balanced-dashboard/models/customer";
import Testing from "balanced-dashboard/tests/helpers/testing";

module("ResultsLoader - MarketplaceSearchResultsLoader", {
	teardown: function() {
		Testing.restoreMethods(
			SearchModelArray.newArrayLoadedFromUri,
			SearchModelArray.create
		);
	},
});

test("#results", function() {
	var searchStub = sinon.stub(SearchModelArray, "newArrayLoadedFromUri");
	var createStub = sinon.stub(SearchModelArray, "create");

	var subject = MarketplaceSearchResultsLoader.create({
		path: "/search",
		resultsType: Customer
	});

	subject.set("query", null);
	subject.get("results");
	deepEqual(createStub.firstCall.args, [{
		isLoaded: true
	}]);

	subject.set("query", "Kermit");
	subject.get("results");
	deepEqual(searchStub.firstCall.args, [
		"/search?sort=created_at%2Cdesc&type%5Bin%5D=credit%2Cdebit%2Ccard_hold%2Crefund%2Creversal&q=Kermit",
		Customer
	]);
});
