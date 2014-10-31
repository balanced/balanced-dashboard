import OrderTransactionsTable from "balanced-dashboard/views/results/order-transactions-table";
import Testing from "balanced-dashboard/tests/helpers/testing";

module("View - OrderTransactionsTable", {
});

test("#groupedResults", function() {
	var BUYERS = [Ember.Object.create({
		uri: "/customers/CUxxxxxx1111111"
	}), Ember.Object.create({
		uri: "/customers/CU2"
	})];


	var testArray = function(debits, expectation) {
		var subject = OrderTransactionsTable.create({
			customers: BUYERS,
			loader: Ember.Object.create({results: debits})
		});
		var results = subject.get("groupedResults");

		expectation.forEach(function(object, index) {
			equal(results[index].get("customer"), object.customer, "Buyer for uri " + object.customer_uri);
			equal(results[index].get("customer_uri"), object.customer_uri, "Buyer uri for uri " + object.customer_uri);
			deepEqual(results[index].get("transactions"), object.transactions, "transactions for uri " + object.customer_uri);
		});
	};

	var debitArray = [Ember.Object.create({
		customer_uri: "/customers/CUxxxxxx1111111",
	})];

	var debitArray2 = [Ember.Object.create({
		customer_uri: "/customers/CUxxxxxx1111111",
	}), Ember.Object.create({
		customer_uri: "/customers/CU2",
	}), Ember.Object.create({
		customer_uri: "/customers/CUxxxxxx1111111",
	})];

	testArray([], []);

	testArray(debitArray, [{
		customer: BUYERS[0],
		customer_uri: "/customers/CUxxxxxx1111111",
		transactions: [
			debitArray[0]
		]
	}]);

	testArray(debitArray2, [{
		customer: BUYERS[0],
		customer_uri: "/customers/CUxxxxxx1111111",
		transactions: [
			debitArray2[0],
			debitArray2[2]
		]
	}, {
		customer: BUYERS[1],
		customer_uri: "/customers/CU2",
		transactions: [
			debitArray2[1]
		]
	}]);
});
