module('Holds', {
	setup: function () {
		Testing.selectMarketplaceByName();

		Balanced.Adapter.asyncCallbacks = true;

		Ember.run(function () {
			var hold = Balanced.Hold.find('/v1/marketplaces/TEST-MP5m04ORxNlNDm1bB7nkcgSY/holds/HL5oPyl3e5QKjtMdbsnLhYpy');
			Balanced.Router.create().transitionTo('holds', hold);
		});
	}, teardown: function () {
	}
});

test('can visit page', function (assert) {
	Ember.run(function() {
		assert.notEqual($('#content h1').text().indexOf('Hold'), -1, 'Title is not correct');
		assert.equal($(".transaction-description").text().trim(), 'Created: $42.00');
	});
});
