module('Disputes', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDispute();
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	visit(Testing.DISPUTE_ROUTE).then(function() {
		assert.notEqual($('#content h1').text().indexOf('Dispute'), -1, 'Title is not correct');
		assert.equal($(".debit .transaction-description").text().trim(), 'Succeeded: $100.00');
	});
});
