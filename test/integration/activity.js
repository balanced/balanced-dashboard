module('Activity', {
    setup: function () {
        Testing.selectMarketplaceByName();

        // click the activity link
        $('#marketplace-nav .activity a').click();
    }, teardown: function () {

    }
});

test('can visit page', function (assert) {

    var $title = $('#content h1');

    assert.notEqual($title.text().indexOf('Activity'), -1,
        'Title is incorrect');

    // Put this back in when the activity page supports downloads
    /*
    assert.notEqual($title.text().indexOf('Download'), -1,
        'Download link not in title "{0}"'.format($title.text()));
    */
});

test('can visit pages', function (assert) {
    var links = [
        ['Cards & Bank Accounts', 'funding-instruments'],
        ['Customers', 'accounts'],
        ['Transactions', 'transactions']
    ];
    expect(links.length * 2);
    _.each(links, function (linkAndClass) {
        var link = linkAndClass[0],
            cls = linkAndClass[1];
        var $link = $('a:contains("' + link + '")');
        assert.ok($link.length, link + ' link exists');
        $link.click();
        assert.ok($('table.items.' + cls).length, link + ' table visible');
    });
});


test('add funds', function(assert) {
    assert.notEqual($('.activity-escrow-box .amount .number1d').html().indexOf('1,137.81'), -1, 'escrow amount is $1,137.81');

    $('.activity-escrow-box .span4 .btn').first().click();

    assert.equal($('#add-funds').css('display'), 'block', 'add funds modal visible');

    // assert.notEqual($('#add-funds select option').length, 0, 'at least one bank account in account dropdown');

    // $('#add-funds input').first().val('55.55');
    // $('#add-funds .modal-footer .btn').not('.danger').click();

    // assert.equal($('#add-funds').css('display'), 'none', 'add funds modal hidden');

    //assert.notEqual($('.activity-escrow-box .amount .number1d').html().indexOf('1137.81'), -1, 'escrow amount is now $1193.36');
});

test('withdraw funds', function(assert) {
    assert.notEqual($('.activity-escrow-box .amount .number1d').html().indexOf('1,137.81'), -1, 'escrow amount is $1,137.81');

    $('.activity-escrow-box .span4 .btn').eq(1).click();

    assert.equal($('#withdraw-funds').css('display'), 'block', 'withdraw funds modal visible');

    // assert.notEqual($('#withdraw-funds select option').length, 0, 'at least one bank account in account dropdown');

    // $('#withdraw-funds input').first().val('55.55');
    // $('#withdraw-funds .modal-footer .btn').not('.danger').click();

    // assert.equal($('#withdraw-funds').css('display'), 'none', 'withdraw funds modal hidden');

    //assert.notEqual($('.activity-escrow-box .amount .number1d').html().indexOf('1082.26'), -1, 'escrow amount is now $1082.26');
});

