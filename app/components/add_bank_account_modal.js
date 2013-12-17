require('app/components/modal');

Balanced.AddBankAccountModalComponent = Balanced.ModalComponent.extend({
	actions: {
		open: function() {
			var bankAccount = Balanced.BankAccount.create({
				name: '',
				account_number: '',
				routing_number: '',
				type: ''
			});

			this._super(bankAccount);

			this.$('form input:radio[name=account_type][value=checking]').prop('checked', true);
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			var bankAccount = this.get('model');

			// this isn't an ember widget, so have to grab it ourselves
			bankAccount.set('type', $('#add-bank-account form input[name=account_type]:checked').val());

			bankAccount.tokenizeAndCreate(this.get('customer.id')).then(function() {
				self.get('customer.bank_accounts').reload();
				self.hide();
			});
		}
	}
});
