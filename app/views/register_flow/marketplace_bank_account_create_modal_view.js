var Full = Balanced.Modals.FullModalMixin;
var Save = Balanced.Modals.ObjectValidateAndSaveMixin;

Balanced.MarketplaceBankAccountCreateModalView = Balanced.ModalBaseView.extend(Full, Save, {
	templateName: "register_flow/marketplace_bank_account_create_modal",
	title: "Step 3 of 3: Link your bank account",
	accountTypes: [{
		value: "checking",
		label: "Checking"
	}, {
		value: "savings",
		label: "Savings"
	}],

	actions: {
		nextStep: function(bankAccountHref) {
			var marketplace = this.get("marketplace");
			var controller = this.get("container").lookup("controller:application");
			controller
				.send("openModal", Balanced.BankAccountFindIntermediateStateModalView, marketplace, bankAccountHref);
		},
		save: function() {
			var self = this;
			var model = this.get("model");
			this.save(model)
				.then(function(bankAccountHref) {
					self.send("nextStep", bankAccountHref);
				});
		}
	}
});

Balanced.MarketplaceBankAccountCreateModalView.reopenClass({
	open: function(marketplace) {
		var model = Balanced.MarketplaceBankAccountFactory.create({
			name: "Cool guy",
			account_number: "11111111111",
			routing_number: "123123123"
		});
		return this.create({
			model: model,
			marketplace: marketplace
		});
	}
});
