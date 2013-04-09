(function () {
    'use strict';

    var fixtureAdapter;

    module('tests.store.module', {
            setup: function () {
                fixtureAdapter = DS.FixtureAdapter.extend({

                });
                Balanced.Store.reopen({
                    adapter: fixtureAdapter
                });

                //  TODO: how does this work?
                Balanced.Marketplace.FIXTURES = [
                    {id: 1, name: '1'},
                    {id: 2, name: 'poop'},
                    {id: 3, name: 'poop'}
                ];
            },
            teardown: function () {
                // teardown code
            }
        }
    );

    test("fixtureAdapter initialization", function () {
        ok(fixtureAdapter !== null, "fixtureAdapter not initialized");
    });
})();
