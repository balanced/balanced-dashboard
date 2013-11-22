Balanced.CustomersView = Balanced.View.extend({
	actions: {
		openAddBankAccountModal: function() {
			this.get('addBankAccountModal').send('open');
		},

		openAddCardModal: function() {
			this.get('addCardModal').send('open');
		}
	}
});
