module('Marketplaces.Index', {
	setup: function() {},
	teardown: function() {
		$("#delete-marketplace").modal('hide');
	}
});

test('view a marketplace sets the mru cookie', function(assert) {
	Testing.selectMarketplaceByName();
	assert.equal(
		$.cookie(Balanced.COOKIE.MARKETPLACE_URI),
		'/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY',
		'mru cookie is set'
	);
});

test('view marketplace list', function(assert) {
	assert.equal($('#marketplaces ul').find('a').first().text(), 'Nick\'s Test Marketplace');
});

test('view single marketplace', function(assert) {
	$('#marketplaces ul a:contains("Nick\'s Test Marketplace")').click();
	assert.equal($('#marketplace-name').text().trim(), 'Nick\'s Test Marketplace');
});

test('add test marketplace', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	// Open marketplaces page
	$("#marketplaces li.manage-marketplaces a").click();

	// enter a name
	$(".marketplace-list.test li.new input[name='name']").val('NEW MARKETPLACE').trigger('keyup');

	// click add
	$(".marketplace-list.test li.new form button").click();

	assert.ok(spy.calledOnce);
});

test('add existing marketplace', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	// Open marketplaces page
	$("#marketplaces li.manage-marketplaces a").click();

	// enter a secret
	$(".marketplace-list.production li.new input[name='secret']").val('1234').trigger('keyup');

	// click add
	$(".marketplace-list.production li.new form button").click();

	assert.ok(spy.calledOnce);
});

test('delete marketplace', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "delete");

	// Open marketplaces page
	$("#marketplaces li.manage-marketplaces a").click();

	// click the delete button
	$(".marketplace-list.test li").first().find(".icon-delete").click();

	// click save
	$('#delete-marketplace .modal-footer button[name="modal-submit"]').click();

	assert.ok(spy.calledOnce, "Delete should have been called once");
});

test('delete marketplace only deletes once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "delete");

	// Open marketplaces page
	$("#marketplaces li.manage-marketplaces a").click();

	// click the delete button
	$(".marketplace-list.test li").first().find(".icon-delete").click();

	// click save
	for (var i = 0; i < 20; i++) {
		$('#delete-marketplace .modal-footer button[name="modal-submit"]').click();
	}

	assert.ok(stub.calledOnce, "Delete should have been called once");
});
