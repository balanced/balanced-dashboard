(function () {
    'use strict';

    test("marketplaces.index", function () {
        var controller = Balanced.MarketplacesIndexRoute.create({ content: [{name: 'marketplace 1e'}] });

        notEqual(controller.view, null);
    });
})();
