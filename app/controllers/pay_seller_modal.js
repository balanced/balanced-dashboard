Balanced.PaySellerModalController = Balanced.ObjectController.extend(Balanced.Modal, {
	needs: 'marketplace',

	amount_dollars: 0,

	initModal: function() {
		var credit = Balanced.Credit.create({uri: '/v1/credits'});
		credit.set('bank_account', Balanced.BankAccount.create());
		this.set('model', credit);
	},

	credit: function() {
		var self = this;
		var credit = this.get('model');

		credit.set('amount', Balanced.Utils.dollarsToCents(this.get('amount_dollars')));

		credit.create().then(function(credit) {
			self.close();

			// this junk is in here because of the iframe code. Take it out when we clean that up!
			var marketplace = self.get('controllers.marketplace.model');
			window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(marketplace.get('uri')) + Balanced.Utils.uriToDashboardFragment(credit.get('uri'));

			// This is what we should be doing to transition
			// self.transitionToRoute('credits.credit', credit);
		})
	}
});
