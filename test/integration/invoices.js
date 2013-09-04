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

test('invoice detail page', function(assert) {
	visit('/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY/invoices/IVDOATjeyAPTJMJPnBR83uE')
	.then(function() {
		assert.equal($(".invoice-balance-due-box .amount").text().trim(), "$17.85");
		assert.equal($(".hold-details-row .total").text().trim(), "$17.85");
		assert.equal($(".card-debit-details-row .total").text().trim(), "$2.45");
		assert.equal($(".bank-account-debit-details-row .total").text().trim(), "$0.00");
		assert.equal($(".succeeded-credit-details-row .total").text().trim(), "$0.00");
		assert.equal($(".failed-credit-details-row .total").text().trim(), "$0.00");
		assert.equal($(".refund-details-row .total").text().trim(), "-$2.45");
		assert.equal($(".reversal-details-row .total").text().trim(), "$0.00");
		assert.equal($(".chargeback-details-row .total").text().trim(), "$0.00");
		assert.equal($(".subtotal-row .total").text().trim(), "$17.85");
		assert.equal($(".adjustments-row .total").text().trim(), "$0.00");
		assert.equal($(".total-balance-row .total").text().trim(), "$17.85");
	});
});
