import { test, moduleFor } from 'ember-qunit';

moduleFor("view:import-payouts/import-payouts", "View - ImportPayouts");

test("#title", function() {
	var view = this.subject({
		controller: {
			creditCreators: {
				isDataMissing: true
			}
		}
	});

	equal(view.get("title"), "Upload your file");

	view.set("creditCreators.isDataMissing", false);
	equal(view.get("title"), "Payout summary");
});

test("#escrowDifference", function() {
	var view = this.subject({
		payoutTotal: 1000,
		controller: {
			controllers: {
				marketplace: {
					in_escrow: 500
				}
			}
		}
	});
	equal(view.get("escrowDifference"), -500);
});

test("#isEscrowValid", function() {
	var view = this.subject({
		payoutTotal: 1000,
		controller: {
			controllers: {
				marketplace: {
					in_escrow: 500
				}
			}
		}
	});
	ok(!view.get("isEscrowValid"));
	view.set("controller.controllers.marketplace.in_escrow", 1500);
	ok(view.get("isEscrowValid"));
});
