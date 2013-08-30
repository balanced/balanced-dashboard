module('Events', {
	setup: function () {
	}, teardown: function () {
	}
});

test('can visit page', function (assert) {
	visit('/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/events/EV861bf0500b8c11e3b9fb026ba7f8ec28').then(function() {
		assert.notEqual($('#content h1').text().indexOf('credit.created'), -1, 'Title is not correct');
		assert.equal($(".event-data-info h3").text().trim(), 'Event data');
		assert.equal($(".webhook-info h3").text().trim(), 'Webhooks');
	});
});

