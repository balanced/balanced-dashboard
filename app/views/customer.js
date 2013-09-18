Balanced.CustomersView = Balanced.View.extend({
	actions: {
		openDebitCustomerModal: function () {
			this.get('debitCustomerModal').send('open');
		},

		openCreditCustomerModal: function () {
			this.get('creditCustomerModal').send('open');
		},

		openAddBankAccountModal: function () {
			this.get('addBankAccountModal').send('open');
		},

		openAddCardModal: function () {
			this.get('addCardModal').send('open');
		}
	}
});
