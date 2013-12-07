require('app/components/modal');

Balanced.ReverseCreditModalComponent = Balanced.ModalComponent.extend({
	modalElement: '#reverse-credit',
	submitAction: 'submitReverseCredit',

	actions: {
		open: function() {
			var reversal = Balanced.Reversal.create({
				uri: this.get('credit.reversals_uri'),
				credit_uri: this.get('credit.uri'),
				amount: this.get('credit.amount')
			});
			this._super(reversal);
		},

		save: function() {
			this._super(this.get('model'));
		}
	}
});
