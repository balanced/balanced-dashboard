module('Events', {
	setup: function () {
		Testing.selectMarketplaceByName();

		// // TODO - figure out why Travis chokes on callbacks and make these async again
        Balanced.Adapter.asyncCallbacks = false;
        Testing.asyncCallbacks = false;

		Ember.run(function () {
			var event = Balanced.Event.find('/v1/events/EV861bf0500b8c11e3b9fb026ba7f8ec28');
			Balanced.Router.create().transitionTo('events', event);
		});
	}, teardown: function () {
	}
});

asyncTest('can visit page', function (assert) {
    expect(3);
	Testing.execWithTimeoutPromise(function() {

		assert.notEqual($('#content h1').text().indexOf('credit.created'), -1, 'Title is not correct');
		assert.equal($(".event-data-info h3").text().trim(), 'Event data');
		assert.equal($(".webhook-info h3").text().trim(), 'Webhooks');
        start();
	})();
});

