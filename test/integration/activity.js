var activityRoutePath = '/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/activity/transactions';

module('Activity', {
	setup: function () {
	}, teardown: function () {
	}
});

test('can visit page', function (assert) {
  visit(activityRoutePath)
  .then(function() {
    var $title = $('#content h1');

    assert.notEqual($title.text().indexOf('Activity'), -1,
      'Title is incorrect');

    assert.ok($('#activity .download').length, "Download link is visible");
  });
});

test('can visit pages', function (assert) {
	var links = [
		['Cards & Bank Accounts', 'funding-instruments'],
		['Customers', 'accounts'],
		['Transactions', 'transactions']
	];

  visit(activityRoutePath)
  .then(function() {
    expect(links.length * 2);
    _.each(links, function (linkAndClass) {
      var link = linkAndClass[0],
        cls = linkAndClass[1];
      var $link = $('#activity a:contains("' + link + '")');
      assert.ok($link.length, link + ' link exists');
      click($link);
      assert.ok($('#activity table.items.' + cls).length, link + ' table visible');
    });
  });
});

test('pages have download links', function (assert) {
	var links = [
		['Cards & Bank Accounts', false],
		['Customers', false],
		['Transactions', true]
	];

  visit(activityRoutePath)
  .then(function() {
    expect(links.length * 2);
    _.each(links, function (linkAndHasDownload) {
      var link = linkAndHasDownload[0],
        hasDownload = linkAndHasDownload[1];
      var $link = $('#activity a:contains("' + link + '")');
      assert.ok($link.length, link + ' link exists');
      click($link);

      assert.equal($("#activity .download").length, hasDownload ? 1 : 0);
    });
  });
});

test('Click load more shows 5 more and hides load more', function (assert) {
  visit(activityRoutePath)
  .then(function() {
    assert.equal($('#activity .results table.transactions tfoot td').length, 1, 'has "load more"');
  })
  .then(function() {
    click('#activity .results table.transactions tfoot td.load-more-results a');

    assert.equal($('#activity .results table.transactions tbody tr').length, 15, 'has 15 transactions');
    assert.equal($('#activity .results table.transactions tfoot td').length, 0, 'does not have "load more"');
  });
});

test('Filtering by type works', function (assert) {
  visit(activityRoutePath)
  .then(function() {
    assert.equal($('#activity .results table.transactions tbody tr').length, 10, 'has 10 transactions before');
  })
	.click('#activity .results header .transactions .selector a.dropdown-toggle')
  .click('#activity .results header .transactions .selector a:contains("Credits")')
  .then(function() {
    assert.equal($('#activity .results table.transactions tbody tr').length, 1, 'has 1 transactions after');
  });
});

test('add funds', function (assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");


  visit(activityRoutePath)
  .then(function() {
    assert.notEqual($('.activity-escrow-box .amount .number1d').text().indexOf('1,137.81'), -1, 'escrow amount is $1,137.81');
  })
  .click('.activity-escrow-box .btn')
  .then(function() {
    assert.equal($('#add-funds').css('display'), 'block', 'add funds modal visible');
    assert.equal($('#add-funds select option').length, 2, 'bank accounts in account dropdown');
  })
	.fillIn('#add-funds input', '55.55')
	.fillIn('#add-funds input.description', 'Adding lots of money yo')
	.click('#add-funds .modal-footer button[name="modal-submit"]')
	.then(function() {
		assert.ok(spy.calledOnce);
		assert.ok(spy.calledWith(Balanced.Debit, '/v1/customers/CU1DkfCFcAemmM99fabUso2c/debits'));
		assert.equal(spy.getCall(0).args[2].amount, 5555);
		assert.equal(spy.getCall(0).args[2].description, 'Adding lots of money yo');
	});
});

test('add funds only adds once despite multiple clicks', function (assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

  visit(activityRoutePath)
  .click('.activity-escrow-box .btn')
	.fillIn('#add-funds input', '55.55')
  .click('#add-funds .modal-footer button[name="modal-submit"]')
  .click('#add-funds .modal-footer button[name="modal-submit"]')
  .click('#add-funds .modal-footer button[name="modal-submit"]')
  .click('#add-funds .modal-footer button[name="modal-submit"]')
  .then(function() {
    assert.ok(stub.calledOnce);
  });
});

test('withdraw funds', function (assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");
  visit(activityRoutePath)
  .then(function() {
    assert.notEqual($('.activity-escrow-box .amount .number1d').text().indexOf('1,137.81'), -1, 'escrow amount is $1,137.81');
  })
	.click('.activity-escrow-box .btn')
  .then(function() {
    assert.equal($('#withdraw-funds').css('display'), 'block', 'withdraw funds modal visible');
    assert.equal($('#withdraw-funds select option').length, 4, 'bank accounts in account dropdown');
  })
	.fillIn('#withdraw-funds input', '55.55')
	.fillIn('#withdraw-funds input.description', 'Withdrawing some monies')
	.click('#withdraw-funds .modal-footer button[name="modal-submit"]')
	.then(function() {
		assert.ok(spy.calledOnce);
		assert.ok(spy.calledWith(Balanced.Credit, '/v1/customers/CU1DkfCFcAemmM99fabUso2c/credits'));
		assert.equal(spy.getCall(0).args[2].amount, 5555);
		assert.equal(spy.getCall(0).args[2].description, 'Withdrawing some monies');
	});
});

test('withdraw funds only withdraws once despite multiple clicks', function (assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

  visit(activityRoutePath)
  .click('.activity-escrow-box .btn')
	.fillIn('#withdraw-funds input', '55.55')
	.click('#withdraw-funds .modal-footer button[name="modal-submit"]')
	.click('#withdraw-funds .modal-footer button[name="modal-submit"]')
	.click('#withdraw-funds .modal-footer button[name="modal-submit"]')
	.click('#withdraw-funds .modal-footer button[name="modal-submit"]')
  .then(function() {
    assert.ok(stub.calledOnce);
  });
});

test('download activity', function (assert) {
	assert.equal($(".alert span").length, 0);

	var stub = sinon.stub(Balanced.Adapter, "create");
	stub.withArgs(Balanced.Download).callsArgWith(3, {
		download: {}
	});

	visit(activityRoutePath)
	.click("#activity .icon-download")
	.fillIn(".download-modal.in form input[name='email']", "test@example.com")
	.click('.download-modal.in .modal-footer button[name="modal-submit"]')
	.then(function() {
		assert.ok(stub.calledOnce);
		assert.ok(stub.calledWith(Balanced.Download, '/downloads', {
			email_address: "test@example.com",
			uri: "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/search?limit=10&offset=0&q=&sort=created_at%2Cdesc&type%5Bin%5D=credit%2Cdebit%2Crefund%2Chold"
		}));
		assert.equal($(".alert span").length, 1);
		assert.equal($(".alert span").text(), "We're processing your request. We will email you once the exported data is ready to view.");
	});
});

test('download activity only runs once despite multiple clicks', function (assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

  visit(activityRoutePath)
	.click("#activity .icon-download")
	.fillIn(".download-modal.in form input[name='email']", 'test@example.com')
	.click('.download-modal.in .modal-footer button[name="modal-submit"]')
	.click('.download-modal.in .modal-footer button[name="modal-submit"]')
	.click('.download-modal.in .modal-footer button[name="modal-submit"]')
	.click('.download-modal.in .modal-footer button[name="modal-submit"]')
  .then(function() {
    assert.ok(stub.calledOnce);
  });
});

test('transactions date sort has two states', function (assert) {
  visit(activityRoutePath)
  .then(function() {
    var objectPath = "#activity .results th.date";
    var states = [];
    var getSate = function(){
      if($(objectPath).hasClass("unsorted")){
        if($.inArray("unsorted", states) === -1){
          states.push("unsorted");
        }
      }else if($(objectPath).hasClass("ascending")){
        if($.inArray("ascending", states) === -1){
          states.push("ascending");
        }
      }else if($(objectPath).hasClass("descending")){
        if($.inArray("descending", states) === -1){
          states.push("descending");
        }
      }
    };

    var count = 0;
    var testAmount = 5;
    while(count !== testAmount){
      click($(objectPath));
      getSate();
      count ++;
    }
    states.sort();

    var expectedStates = ["ascending", "descending"];
    assert.equal(states[0], expectedStates[0]);
    assert.equal(states[1], expectedStates[1]);
    assert.equal(states.length, 2);
  });
});
