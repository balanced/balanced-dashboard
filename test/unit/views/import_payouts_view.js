module("Balanced.ImportPayoutsView");

test("#title", function(assert) {
	var view = Balanced.ImportPayoutsView.create({
		controller: {
			creditCreators: {
				isEmpty: true
			}
		}
	});

	assert.equal(view.get("title"), "Upload your file");

	view.set("creditCreators.isEmpty", false);
	assert.equal(view.get("title"), "Payout summary");
});

test("#escrowDifference", function(assert) {
	var view = Balanced.ImportPayoutsView.create({
		payoutTotal: 1000,
		controller: {
			controllers: {
				marketplace: {
					in_escrow: 500
				}
			}
		}
	})
	assert.equal(view.get("escrowDifference"), -500);
});

test("#isEscrowValid", function(assert) {
	var view = Balanced.ImportPayoutsView.create({
		payoutTotal: 1000,
		controller: {
			controllers: {
				marketplace: {
					in_escrow: 500
				}
			}
		}
	})
	assert.ok(!view.get("isEscrowValid"));
	view.set("controller.controllers.marketplace.in_escrow", 1500);
	assert.ok(view.get("isEscrowValid"));
});
