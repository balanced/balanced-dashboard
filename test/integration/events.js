module('Events', {
	setup: function() {
		Balanced.TEST.setupMarketplace();
		var stop = window.stop;
		stop();
		setTimeout(start, 1000);
		Balanced.NET.ajax({
			url: ENV.BALANCED.API + '/v1/events',
			type: 'get'
		}).done(function(res) {
			Balanced.TEST.EVENT_ID = res.items[0].id;
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
