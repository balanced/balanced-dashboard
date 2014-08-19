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

	isInitialDepositCreate: false,
	isInitialDepositTransactionCreated: false,
	initialDepositModel: function() {
		return Balanced.InitialDepositTransactionFactory.create({
			number: "4111 1111 1111 1111",
			cvv: "111",
			expiration_month: 6,
			expiration_year: 2016,
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

	save: function(bankAccountModel, initialDepositModel) {
		var self = this;
		return this
			.validate(bankAccountModel, initialDepositModel)
			.then(function() {
				if (initialDepositModel) {
					return initialDepositModel.save()
						.then(function(debit) {
							self.getModalNotificationController().alertSuccess("Initial deposit was made from your bank account.");
						});
				}
			})
			.then(function() {
				self.set("isInitialDepositTransactionCreated", true);
				return bankAccountModel.save();
			});
	},

	getInitialDepositModel: function() {
		return this.get("isInitialDepositCreate") ?
			this.get("initialDepositModel") : undefined;
	},

	isSaving: false,
	makeSaving: function() {
		this.getModalNotificationController().alertWarning("Saving...", {
			name: "Saving"
		});
		this.set("isSaving", true);
		this.$(":input").attr("disabled", true);
	},

	unmakeSaving: function() {
		this.getModalNotificationController().clearNamedAlert("Saving");
		this.set("isSaving", false);

		if (this.get("element")) {
			this.$(":input").attr("disabled", false);
		}
	},

	actions: {
		save: function() {
			var self = this;
			var marketplace = this.get("marketplace");
			var model = this.get("model");

			this.makeSaving();

			this.save(model, this.getInitialDepositModel())
				.then(function(bankAccountHref) {
					return self.get("container")
						.lookup("controller:owner_customer_bank_account")
						.linkAndVerify(marketplace, bankAccountHref)
						.finally(function() {
							self.close();
						});
				})
				.finally(function() {
					self.unmakeSaving();
					self.getNotificationController()
						.alertSuccess("Bank account linked. Remember to verify your bank account once you receive your micro-deposits in 1–2 business days.");
				});
		}
	}
});
