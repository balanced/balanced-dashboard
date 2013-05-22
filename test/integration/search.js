module("Search");

test("search is there", function () {
    $("#marketplaces ul a:contains('Test Marketplace')").click();

    var $search = $('#search');
    equal($search.length, 1);
});

test("drops down when there is content", function () {
    $("#marketplaces ul a:contains('Test Marketplace')").click();

    var $q = $('#q');
    var $search = $('#search');

    function setVal(val) {
        $q.val(val).trigger('keyup');
    }

    setVal('t');
    notEqual(($search.attr('class') || '').indexOf('with-results'), -1);

    setVal('');
    equal(($search.attr('class') || '').indexOf('with-results'), -1);
});

test('clicking close resets the search', function () {
    var $q = $('#q');

    $q.val('t').trigger('keyup');
    equal($('#search .close:visible').length, 1, 'Search is not visible');
    $('#search .close').click();
    equal($q.val(), '', 'Search query did not reset');
});

test('can filter by type', function () {
    $("#marketplaces ul a:contains('Test Marketplace')").click();
    var $q = $('#q');
    $q.val('t').trigger('keyup');
    $('#search .results header li.accounts > a').trigger($.Event('click'));
    var selected = $('#search .results header li.accounts.selected').length;
    equal(selected, 1);
});

test('running a search returns results', function () {
    $("#marketplaces ul a:contains('Test Marketplace')").click();

    var $q = $('#q');
    $q.val('t').trigger('keyup');
    equal($('#search .results header li.transactions > a').text().trim(), 'Transactions (18)');
});
