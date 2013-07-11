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
        }
    };
})();