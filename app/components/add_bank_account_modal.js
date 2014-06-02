require('app/components/modal');

Balanced.AddBankAccountModalComponent = Balanced.ModalComponent.extend({

	// There's no good ember view for handling radio buttons so we're
	// using a dumb hack.
	getAccountType: function() {
		return this.$(".account-type:checked").val();
	},

	actions: {
		open: function() {
			var bankAccount = Balanced.BankAccount.create({
				name: '',
				account_number: '',
				routing_number: '',
				account_type: ''
			});

			this._super(bankAccount);
			this.$(".account-type:first").prop("checked", true);
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			var bankAccount = this.get('model');
			bankAccount.set("account_type", this.getAccountType());

			bankAccount.tokenizeAndCreate(this.get('customer.id')).then(function() {
				if (self.get('customer')) {
					self.get('customer.bank_accounts').reload();
				}

				self.hide();
			});
		}
	}
});
