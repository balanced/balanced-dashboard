module("Search");

test("search box exists", function () {
    Testing.selectMarketplaceByName();

    equal($("#q").length, 1);
});

test("search results show and hide", function() {
    Testing.selectMarketplaceByName();
    Testing.runSearch('%');

    equal($("#search").hasClass("with-results"), true);
    equal($("#main-overlay").css('display'), 'block');
    equal($("body").hasClass("overlaid"). true);

    Testing.runSearch('');

    equal($("#search").hasClass("with-results"), false);
    equal($("#main-overlay").css('display'), 'none');
    equal($("body").hasClass("overlaid"), false);
});

test("search results hide on click [x]", function() {
    Testing.selectMarketplaceByName();
    Testing.runSearch('%');

    $("#search span.close").click();

    equal($("#q").val(), '');
    equal($("#search").hasClass("with-results"), false);
    equal($("#main-overlay").css('display'), 'none');
    equal($("body").hasClass("overlaid"), false);
});

test("search '%' returns 22 transactions total, showing 10 transactions in results, with load more", function() {
    Testing.selectMarketplaceByName();
    Testing.runSearch('%');

    // Has 22 transactions in the header
    equal($("#search .results li.transactions > a:contains('22')").length, 1, "has 22 transaction in header");

    // Has 10 visible rows of transactions
    equal($("#search .results table.transactions tbody tr").length, 10, "has 10 transactions");

    // Has load more
    equal($("#search .results table.transactions tfoot td").length, 1, "has 'load more'");
});

////
// The following need more fixtures defined in search_query.js
////

// test("search '%', click accounts, returns 19 accounts total, showing 10 accounts in results, with load more", function() {
//     Testing.selectMarketplaceByName();
//     Testing.runSearch('%');

//     $("#search .results li.accounts > a").click();

//     console.log($("#search .results nav li.accounts").html());

//     // Has 19 accounts in the header
//     equal($("#search .results li.accounts > a:contains('19')").length, 1, "has 19 accounts in header");

//     // Has 10 visible rows of accounts
//     equal($("#search .results table.accounts tbody tr").length, 10, "has 10 accounts");

//     // Has load more
//     equal($("#search .results table.accounts tfoot td").length, 1, "has 'load more'");
// });

// test("search '%' returns 22 transactions. Click load more shows 10 more. Click load more again shows 2 more, and hides load more", function() {
//     Testing.selectMarketplaceByName();
//     Testing.runSearch('%');

//     // Has load more
//     equal($("#search .results table.transctions tfoot td").length, 1, "has 'load more'");

//     $("#search .results table.transactions tfoot td.load-more-results a").click();

//     // Has 20 visible rows of transactions
//     equal($("#search .results table.transactions tbody tr").length, 20, "has 20 transactions");

//     // Has load more
//     equal($("#search .results table.transactions tfoot td").length, 1, "has 'load more'");

//     $("#search .results table.transactions tfoot td.load-more-results a").click();

//     // Has 22 visible rows of transactions
//     equal($("#search .results table.transactions tbody tr").length, 22, "has 22 transactions");

//     // Does not have load more
//     equal($("#search .results table.transactions tfoot td").length, 0, "does not have 'load more'");
// });

// test("search '%' return 22 transactions. Click filter by holds.", function() {
//     Testing.selectMarketplaceByName();
//     Testing.runSearch('%');

//     $("#search .results li.transactions a.dropdown-toggle").click();

//     // Transaction filter menu visible
//     equal($("#search .results li.transactions ul.transaction-filter").css("display"), 'block', "transaction filter menu visible");

//     $("#search .results li.transactions ul.transaction-filter a:contains('Holds')").click();

//     // Has 8 hold transactions in the header
//     equal($("#search .results li.transactions > a:contains('8')").length, 1, "has 8 hold transactions in header");

//     // Has 8 visible rows of hold transactions
//     equal($("#search .results table.transactions tbody tr").length, 8, "has 8 hold transactions");
// });
