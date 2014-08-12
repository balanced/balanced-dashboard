var Save = Balanced.Modals.ObjectValidateAndSaveMixin;

Balanced.MarketplaceBankAccountCreateModalView = Balanced.RegisterFlowBaseModal.extend(Save, {
	templateName: "register_flow/marketplace_bank_account_create_modal",
	title: "Step 3 of 3: Link your bank account",
	accountTypes: [{
		value: "checking",
		label: "Checking"
	}, {
		value: "savings",
		label: "Savings"
	}],

	model: function() {
		return Balanced.MarketplaceBankAccountFactory.create({
			name: "Cool guy",
			account_type: "savings",
			account_number: "11111111111",
			routing_number: "123123123"
		});
	}.property(),

	actions: {
		nextStep: function(marketplace, bankAccountHref) {
			this.openNext(Balanced.BankAccountFindIntermediateStateModalView, {
				marketplace: marketplace,
				bankAccountHref: bankAccountHref
			});
		},
		save: function() {
			var self = this;
			var model = this.get("model");
			var marketplace = this.get("marketplace");

			this.save(model)
				.then(function(bankAccountHref) {
					self.send("nextStep", marketplace, bankAccountHref);
				});
		}
	}
});
