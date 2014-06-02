module("Balanced.NotificationsView");

var subject = function(marketplace) {
	return Balanced.NotificationsView.create({
		marketplace: Ember.Object.create(marketplace)
	});
};

test("#bankAccountsNotificationsManager.isProduction", function(assert) {
	var view = subject({});
	var marketplace = view.get("marketplace");

	assert.ok(!view.get("bankAccountsNotificationsManager.isProduction"));

	marketplace.set("production", false);
	assert.ok(!view.get("bankAccountsNotificationsManager.isProduction"));

	view.set("marketplace.production", true);
	assert.ok(view.get("bankAccountsNotificationsManager.isProduction"));
});

test("#bankAccountsNotificationsManager.isShowBankAccountNotifications", function(assert) {
	var view = subject();
	var manager = view.get("bankAccountsNotificationsManager");

	var managerSetter = function(production, isLoaded) {
		manager.setProperties({
			marketplace: {
				production: production
			},
			bankAccounts: {
				isLoaded: isLoaded
			}
		});
	};

	assert.deepEqual(manager.get("isShowBankAccountNotifications"), false);
	managerSetter(true, false);
	assert.deepEqual(manager.get("isShowBankAccountNotifications"), false);

	managerSetter(true, true);
	assert.deepEqual(manager.get("isShowBankAccountNotifications"), true);

	managerSetter(false, true);
	assert.deepEqual(manager.get("isShowBankAccountNotifications"), false);
});

test("#bankAccountsNotificationsManager.isBankAccountsEmpty", function(assert) {
	var view = subject();
	var manager = view.get("bankAccountsNotificationsManager");

	manager.set("bankAccounts", []);
	assert.ok(manager.get("isBankAccountsEmpty"), "True when no bank accounts");

	manager.set("bankAccounts", ["cool"]);
	assert.ok(!manager.get("isBankAccountsEmpty"), "Not true when there are bank accounts");
});

test("#bankAccountsNotificationsManager.isNeedsStartVerification", function(assert) {
	var view = subject();
	var manager = view.get("bankAccountsNotificationsManager");

	var setBankAccounts = function(bankAccounts) {
		manager.set("bankAccounts", bankAccounts);
	};

	setBankAccounts([]);
	assert.ok(!manager.get("isNeedsStartVerification"), "Cannot start with empty bank accounts");

	setBankAccounts([{
		can_debit: true,
		can_verify: false,
	}, {
		can_debit: false,
		can_verify: false,
	}]);
	assert.ok(!manager.get("isNeedsStartVerification"), "No need to start if already verified");

	setBankAccounts([{
		can_debit: false,
		can_verify: false,
	}, {
		can_debit: false,
		can_verify: false,
		can_confirm_verification: true
	}]);
	assert.ok(!manager.get("isNeedsStartVerification"), "No need to start if already started");

	setBankAccounts([{
		can_debit: false,
		can_verify: false,
	}, {
		can_debit: false,
		can_verify: true,
	}]);
	assert.ok(manager.get("isNeedsStartVerification"), "Needs to verify if no verification started");
});

test("#bankAccountsNotificationsManager.isNeedsConfirmVerification", function(assert) {
	var view = subject();
	var manager = view.get("bankAccountsNotificationsManager");

	var setBankAccounts = function(bankAccounts) {
		manager.set("bankAccounts", bankAccounts);
	};

	setBankAccounts([]);
	assert.ok(!manager.get("isNeedsConfirmVerification"), "Cannot confirm with empty bank accounts");

	setBankAccounts([{
		can_debit: true
	}, {
		can_confirm_verification: true
	}]);
	assert.ok(!manager.get("isNeedsConfirmVerification"), "No need to confirm when already can debit");

	setBankAccounts([{
		can_confirm_verification: true
	}, {
		can_confirm_verification: false
	}]);
	assert.ok(manager.get("isNeedsConfirmVerification"), "Needs to confirm if can_confirm_verification");

});
