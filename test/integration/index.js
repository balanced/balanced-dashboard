module('Index', {
    setup: function () {
    }
});

test('view a marketplace sets the mru cookie', function (assert) {
    Testing.selectMarketplaceByName();
    assert.equal($.cookie('mru'), '/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY', 'mru cookie is set');

    Balanced.transitionTo('marketeplaces');

    console.log("went to marketplaces?");
    console.log();
    console.log();
});