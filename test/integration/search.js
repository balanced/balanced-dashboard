module("Search");

test("search is there", function () {
    var $search = $('#search');
    equal($search.length, 1);
});

test("drops down when there is content", function () {
    var $q = $('#q');
    var $search = $('#search');

    function setVal(val) {
        $q.val(val).click();
    }

    setVal('hello there');
    notEqual($search.attr('class').indexOf('with-results'), -1);

    setVal('');
    equal($search.attr('class').indexOf('with-results'), -1);
});

test('clicking close resets the search', function () {
    var $q = $('#q');

    $q.val('hello world').click();
    equal($('#search .close:visible').length, 1);

    $('#search .close').click();
    equal($q.val(), '');
});

test('running a search returns results', function() {
    var $q = $('#q');
    $q.val('t');
    $('#q').trigger(jQuery.Event("keyup", { keyCode: 54 }));
    $('#q').trigger(jQuery.Event("keyup", { keyCode: 13 }));

    equal($('#search .results header li.transactions > a').text(), ' Transactions (18) ');
});
