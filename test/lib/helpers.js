var Testing = (function () {
    return {
        init: function () {

        },
        selectMarketplaceByName: function (name) {
            name = name || 'Test Marketplace';
            $('#marketplaces ul a:contains("' + name + '")').click();
        },
        runSearch: function (query) {
            $('#q').val(query).trigger('keyup');
            // Press enter to run the search immediately
            $("#q").trigger(jQuery.Event("keyup", {keyCode: Balanced.KEYS.ENTER}));
        },

        // provides a simple way to chain steps of a test together, while still
        // running any async callbacks each step triggered
        // Returns a function (so calls won't execute until the previous promise
        // finished), so you'll have to make sure to call the first invocation
        // Example:
        // Testing.execWithTimeoutPromise(function() {
        //     $("#activity header .accounts a").click();
        // })().then(Testing.execWithTimeoutPromise(function() {
        //     // this step won't execute until the previous step finished
        //     $("table.accounts tbody tr a").eq(0).click();
        // }));
        execWithTimeoutPromise: function(callback) {
            return function() {
                var dfd = new $.Deferred();
                setTimeout(function() {
                    Ember.run(function() {
                        callback();
                        dfd.resolve();
                    });
                });
                return dfd;
            };
        }
    };
})();
