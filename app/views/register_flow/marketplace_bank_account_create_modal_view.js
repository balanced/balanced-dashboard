Balanced.MarketplaceBankAccountCreateModalView = Balanced.RegisterFlowBaseModal.extend({
	templateName: "register_flow/marketplace_bank_account_create_modal",
	title: "Register for a production marketplace",
	subtitle: "Step 3 of 3: Add your bank account",
	submitButtonText: "Complete registration",
	confirmMessage: "You have not completed the registration process. You will need to add and verify your bank account in order to deposit funds.",

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

	isInitialDepositCreate: true,
	isInitialDepositTransactionCreated: false,
	initialDepositModel: function() {
		return Balanced.InitialDepositTransactionFactory.create({
			number: "4111 1111 1111 1111",
			cvv: "111",
			expiration_month: 1,
			expiration_year: "2014",
			dollar_amount: 10
		});
	}.property(),

	expirationMonths: Balanced.TIME.MONTHS,
	expirationYears: function() {
		var start = new Date().getFullYear();
		return _.times(10, function(i) {
			return start + i;
		});
	}.property(),


	validate: function(bankAccountModel, initialDepositModel) {
		var validate = function(model) {
			if (model) {
				model.validate();
				return model.get("isValid");
			}
			return true;
		};

		if (validate(bankAccountModel) && validate(initialDepositModel)) {
			return Ember.RSVP.resolve();
		} else {
			return Ember.RSVP.reject();
		}
	},

	isSaving: false,
	save: function(bankAccountModel, initialDepositModel) {
		var self = this;
		self.set("isSaving", true);
		return this
			.validate(bankAccountModel, initialDepositModel)
			.then(function() {
				if (initialDepositModel) {
					return initialDepositModel.save();
				}
			})
			.then(function() {
				return self.set("isInitialDepositTransactionCreated", true);
			})
			.then(function() {
				return bankAccountModel.save();
			})
			.then(function(result) {
				self.set("isSaving", false);
				return result;
			}, function(errors) {
				self.set("isSaving", false);
				return Ember.RSVP.reject(errors);
			});
	},

	actions: {
		nextStep: function(marketplace, bankAccountHref) {
			this.openNext(Balanced.BankAccountFindIntermediateStateModalView, {
				marketplace: marketplace,
				bankAccountHref: bankAccountHref
			});
		},
		save: function() {
			var self = this;
			var marketplace = this.get("marketplace");

			var model = this.get("model");
			var initialDepositModel = this.get("isInitialDepositCreate") ?
				this.get("initialDepositModel") : undefined;

			this.save(model, initialDepositModel)
				.then(function(bankAccountHref) {
					self.send("nextStep", marketplace, bankAccountHref);
				});
		}
	}
});
