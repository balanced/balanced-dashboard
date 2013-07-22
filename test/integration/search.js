module('Search', {
    setup: function () {
        Testing.selectMarketplaceByName();
    },
    teardown: function () {
        Ember.run(function () {
            $('#search span.close').click();
        });
    }
});

test('search box exists', function (assert) {
    assert.equal($('#q').length, 1);
});

test('search results show and hide', function (assert) {
    Testing.runSearch('foodbar');

    assert.equal($('#search').hasClass('with-results'), true, 'search has no results');
    assert.equal($('body').hasClass('overlaid'), true, 'overlay not showing');

    Testing.runSearch('');

    assert.equal($('#search').hasClass('with-results'), false, 'blank search has results');
    assert.equal($('body').hasClass('overlaid'), false, 'overlay still showing');
});

test('search results hide on click [x]', function (assert) {
    Testing.runSearch('%');

    $('#search span.close').click();

    assert.equal($('#q').val(), '');
    assert.equal($('#search').hasClass('with-results'), false);
    assert.equal($('#main-overlay').css('display'), 'none');
    assert.equal($('body').hasClass('overlaid'), false);
});

test('search "%" returns 15 transactions total, showing 10 transactions in results, with load more', function (assert) {
    Testing.runSearch('%');

    assert.equal($('#search .results li.transactions > a:contains("15")').length, 1, 'has 15 transaction in header');
    assert.equal($('#search .results table.transactions tbody tr').length, 10, 'has 10 transactions');
    assert.equal($('#search .results table.transactions tfoot td').length, 1, 'has "load more"');
});

test('search "%", click accounts, returns 22 accounts total, showing 10 accounts in results, with load more', function (assert) {
    Testing.runSearch('%');

    $('#search .results li.accounts > a').click();

    assert.equal($('#search .results li.accounts > a:contains("22")').length, 1, 'has 22 accounts in header');
    assert.equal($('#search .results table.accounts tbody tr').length, 10, 'has 10 accounts');
    assert.equal($('#search .results table.accounts tfoot td').length, 1, 'has "load more"');
});

test('search "%" returns 15 transactions. Click load more shows 5 more and hides load more', function (assert) {
    Testing.runSearch('%');

    assert.equal($('#search .results table.transactions tfoot td').length, 1, 'has "load more"');

    $('#search .results table.transactions tfoot td.load-more-results a').click();

    assert.equal($('#search .results table.transactions tbody tr').length, 15, 'has 15 transactions');
    assert.equal($('#search .results table.transactions tfoot td').length, 0, 'does not have "load more"');
});

test('search "%" return 15 transactions. Click filter by holds.', function (assert) {
    Testing.runSearch('%');

    $('#search .results li.transactions a.dropdown-toggle').click();

    assert.equal($('#search .results li.transactions ul.transaction-filter').css('display'), 'block', 'transaction filter menu visible');

    $('#search .results li.transactions ul.transaction-filter a:contains("Holds")').click();

    assert.equal($('#search .results li.transactions > a:contains("6")').length, 1, 'has 6 hold transactions in header');
    assert.equal($('#search .results table.transactions tbody tr').length, 6, 'has 6 hold transactions');
});

test('search date picker dropdown', function (assert) {
    Testing.runSearch('%');

    var toggle = $('#search .timing .dropdown-toggle');
    toggle.click();
    assert.ok(toggle.parent().hasClass('open'));

    var dp = toggle.parent().find('div.date-picker');
    dp.find('[name="after"]').click().focus();
    assert.ok(dp.find('.after').hasClass('selected'), 'after is selected');
    assert.ok(toggle.parent().hasClass('open'), 'date picker is still showing');
});
