Balanced.BankAccountsController = Balanced.ObjectController.extend(
	Ember.Evented,
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

		actions: {
			openDebitFundingInstrumentModal: function() {
				this.trigger('openDebitFundingInstrumentModal');
			},

			openCreditBankAccountModal: function() {
				this.trigger('openCreditBankAccountModal');
			},

			openVerifyBankAccountModal: function() {
				this.trigger('openVerifyBankAccountModal');
			},

			openConfirmVerificationModal: function() {
				this.trigger('openConfirmVerificationModal');
			},
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

		results_base_uri: function() {
			return this.get('content.transactions_uri');
		}.property('content.transactions_uri'),

		can_debit_or_verify: function() {
			return this.get('content.can_debit') || this.get('content.can_verify');
		}.property('content.can_debit', 'content.can_verify')
	}
);
