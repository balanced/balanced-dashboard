import Credit from "balanced-dashboard/models/credit";

module('Model - Credit');

test('#serialize', function() {
	var credit = Credit.create({
		name: "Cool Customer",
		destination_uri: "/destination.ddd",
		order_uri: "orders/ORxxx"
	});

	var serializedJson = credit.constructor.serializer.serialize(credit);
	equal(serializedJson.order, "orders/ORxxx");
	equal(serializedJson.name, "Cool Customer");
	equal(serializedJson.destination_uri, "/destination.ddd");
});
