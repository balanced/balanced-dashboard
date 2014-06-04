Balanced.BankAccountsController = Balanced.ObjectController.extend(
	Balanced.ActionEvented('openDebitFundingInstrumentModal',
		'openCreditFundingInstrumentModal', 'openVerifyBankAccountModal',
		'openConfirmVerificationModal'),
	Balanced.ResultsTable,
	Balanced.TransactionsTable, {
		needs: ['marketplace'],

		sortField: 'created_at',
		sortOrder: 'desc',

		baseClassSelector: "#bank-account",

		init: function() {
			Balanced.Model.Events.on('didCreate', this, this.reloadVerifications);
			Balanced.Model.Events.on('didUpdate', this, this.reloadVerifications);
		},

		reloadVerifications: function(verification) {
			var bankAccount = this.get("content");
			var reloadIfPresent = function(propertyName) {
				var property = bankAccount.get(propertyName);
				if (property !== undefined) {
					property.reload();
				}
			};

			if (Balanced.Verification.prototype.isPrototypeOf(verification) && bankAccount) {

				bankAccount.reload().then(function() {
					reloadIfPresent("verifications");
					reloadIfPresent("verification");
				});
			}
		},

		results_base_uri: Ember.computed.readOnly('content.transactions_uri')
	}
);
