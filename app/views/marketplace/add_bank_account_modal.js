Balanced.AddBankAccountModalView = Balanced.View.extend({
	templateName: 'modals/add_bank_account',

	actions: {
		open: function() {
			var bankAccount = Balanced.BankAccount.create({
				name: '',
				account_number: '',
				routing_number: '',
				type: ''
			});
			this.set('model', bankAccount);
			$('#add-bank-account').modal({
				manager: this.$()
			});
			$('#add-bank-account form input:radio[name=account_type][value=checking]').prop('checked', true);
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
				$('#add-bank-account').modal('hide');
			});
		}
	}
});
