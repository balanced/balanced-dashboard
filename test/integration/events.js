module('Events', {
	setup: function() {
		Testing.setupMarketplace();
		Ember.run(function() {
			Balanced.Event.findAll().then(function(events) {
				var evt = events.objectAt(0);
				Testing.EVENT_ID = evt.get('id');
			});
		});
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
