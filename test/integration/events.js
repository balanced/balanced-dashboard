module('Events', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.setupEvent();
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	visit('/marketplaces/' + Testing.MARKETPLACE_ID + '/events/' + Testing.EVENT_ID)
		.then(function() {
			assert.notEqual($('#content h1').text().indexOf('account.created'), -1, 'Title is correct');
			assert.equal($(".event-data-info h3").text().trim(), 'Event data');
			assert.equal($(".webhook-info h3").text().trim(), 'Webhooks');
		});
});
