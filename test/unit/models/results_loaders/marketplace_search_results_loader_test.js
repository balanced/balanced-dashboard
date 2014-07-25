module("Balanced.MarketplaceSearchResultsLoader", {
	teardown: function() {
		Testing.restoreMethods(
			Balanced.SearchModelArray.newArrayLoadedFromUri,
			Balanced.SearchModelArray.create
		)
	},
});

test("#results", function(assert) {
	var searchStub = sinon.stub(Balanced.SearchModelArray, "newArrayLoadedFromUri");
	var createStub = sinon.stub(Balanced.SearchModelArray, "create");

	var subject = Balanced.MarketplaceSearchResultsLoader.create({
		path: "/search",
		resultsType: Balanced.Customer
	});

	subject.set("query", null);
	subject.get("results");
	assert.deepEqual(createStub.firstCall.args, [{
		isLoaded: true
	}]);

	subject.set("query", "Kermit");
	subject.get("results");
	assert.deepEqual(searchStub.firstCall.args, [
		"/search?sort=created_at%2Cdesc&type%5Bin%5D=credit%2Cdebit%2Ccard_hold%2Crefund%2Creversal&q=Kermit",
		Balanced.Customer
	]);
});
