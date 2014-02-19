Balanced.DeleteBankAccountModalView = Balanced.View.extend({
	templateName: 'modals/delete_bank_account',

	didInsertElement: function() {
		this.get('controller').on('openDeleteBankAccountModal', this, this.open);
		this._super();
	},

	willDestroyElement: function() {
		this.get('controller').off('openDeleteBankAccountModal', this, this.open);
		this._super();
	},

	open: function(bankAccount) {
		this.set('model', bankAccount);
		$('#delete-bank-account').modal({
			manager: this.$()
		});
	},

	actions: {
		deleteBankAccount: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			this.get('model').delete().then(function() {
				$('#delete-bank-account').modal('hide');
			});
		}
	}
});
