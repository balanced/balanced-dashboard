module("Search");

test("search is there", function (assert) {
    var $search = $('#search');
    assert.equal($search.length, 1);
});

test("drops down when there is content", function (assert) {
    var $search = $('#search');

    Testing.runSearch('t');
    assert.notEqual(($search.attr('class') || '').indexOf('with-results'), -1);

    Testing.runSearch('');
    assert.equal(($search.attr('class') || '').indexOf('with-results'), -1);
});

test('clicking close resets the search', function (assert) {
    var $q = $('#q');

    Testing.runSearch('t');

    assert.equal($('#search .close:visible').length, 1, 'Search is not visible');

    $('#search .close').click();

    assert.equal($q.val(), '', 'Search query did not reset');
});

test('can filter by type', function (assert) {
    Testing.selectMarketplaceByName();
    Testing.runSearch('t');

    $('#search .results header li.accounts > a').trigger($.Event('click'));
    var selected = $('#search .results header li.accounts.selected').length;
    assert.equal(selected, 1);
});

test('running a search returns results', function (assert) {
    Testing.selectMarketplaceByName();
    Testing.runSearch('t');

    assert.equal($('#search .results header li.transactions > a').text().trim(), 'Transactions (18)');
});
