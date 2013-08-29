module('Invoices', {
	setup: function () {
		Testing.selectMarketplaceByName();

		// click the invoices link
		$('#marketplace-nav .invoices a').click();
	}, teardown: function () {

	}
});

test('can visit page', function (assert) {
	//  check the page title has been selected
	assert.equal($('#content h1').text().trim(), 'Invoices');
});

test('shows invoices list', function(assert) {
	assert.equal($("#invoices table tbody tr").length, 2);
});
