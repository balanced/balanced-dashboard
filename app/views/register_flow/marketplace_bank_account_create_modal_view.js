var Full = Balanced.Modals.FullModalMixin;
var Save = Balanced.Modals.ObjectValidateAndSaveMixin;
var OpenNext = Balanced.Modals.OpenNextModalMixin;

Balanced.MarketplaceBankAccountCreateModalView = Balanced.ModalBaseView.extend(OpenNext, Full, Save, {
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
		nextStep: function(bankAccountHref) {
			var marketplace = this.get("marketplace");
			this.openNext(Balanced.BankAccountFindIntermediateStateModalView, {
				marketplace: marketplace,
				bankAccountHref: bankAccountHref
			});
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
