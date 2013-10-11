module('Events', {
	setup: function() {
		Balanced.TEST.setupMarketplace();
		Ember.run(function() {
			Balanced.Event.findAll().then(function(events) {
				var evt = events.objectAt(0);
				Balanced.TEST.EVENT_ID = evt.get('id');
			});
		});
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	visit('/marketplaces/' + Balanced.TEST.MARKETPLACE_ID + '/events/' + Balanced.TEST.EVENT_ID)
		.then(function() {
			assert.notEqual($('#content h1').text().indexOf('account.created'), -1, 'Title is correct');
			assert.equal($(".event-data-info h3").text().trim(), 'Event data');
			assert.equal($(".webhook-info h3").text().trim(), 'Webhooks');
		});
});
