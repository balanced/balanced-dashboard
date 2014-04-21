Balanced.BankAccountsController = Balanced.ObjectController.extend(
	Balanced.ActionEvented('openDebitFundingInstrumentModal',
		'openCreditBankAccountModal', 'openVerifyBankAccountModal',
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

		reloadVerifications: function(object) {
			if (Balanced.Verification.prototype.isPrototypeOf(object) && this.get('content')) {
				var self = this;
				this.get('content').reload().then(function() {
					self.get('verification').reload();
					self.get('verifications').reload();
				});
			}
		},

		results_base_uri: Ember.computed.readOnly('content.transactions_uri'),
		can_debit_or_verify: Balanced.computed.orProperties('content.can_debit', 'content.can_verify')
	}
);
