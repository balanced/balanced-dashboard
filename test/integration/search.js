module("Search");

test("search is there", function () {
    var $search = $('#search');
    equal($search.length, 1);
});

test("drops down when there is content", function () {
    var $search = $('#search');

    Testing.runSearch('t');
    notEqual(($search.attr('class') || '').indexOf('with-results'), -1);

    Testing.runSearch('');
    equal(($search.attr('class') || '').indexOf('with-results'), -1);
});

test('clicking close resets the search', function () {
    var $q = $('#q');

    Testing.runSearch('t');

    equal($('#search .close:visible').length, 1, 'Search is not visible');

    $('#search .close').click();

    equal($q.val(), '', 'Search query did not reset');
});

test('can filter by type', function () {
    Testing.selectMarketplaceByName();
    Testing.runSearch('t');

    $('#search .results header li.accounts > a').trigger($.Event('click'));
    var selected = $('#search .results header li.accounts.selected').length;
    equal(selected, 1);
});

test('running a search returns results', function () {
    Testing.selectMarketplaceByName();
    Testing.runSearch('t');

    equal($('#search .results header li.transactions > a').text().trim(), 'Transactions (18)');
});
