import ModalComponent from "./modal";
import Debit from "balanced-dashboard/models/debit";
import Utils from "balanced-dashboard/lib/utils";

var CaptureHoldModalComponent = ModalComponent.extend({
	submitAction: 'submitCaptureHold',

	actions: {
		open: function() {
			var debit = Debit.create({
				uri: this.get('hold.debits_uri'),
				hold_uri: this.get('hold.uri'),
				amount: null
			});

			this.set('dollar_amount', this.get('hold.amount_dollars'));
			this._super(debit);
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var debit = this.get('model');
			var cents = null;
			try {
				cents = Utils.dollarsToCents(this.get('dollar_amount'));
			} catch (error) {
				debit.set('validationErrors', {
					'amount': error
				});
				return;
			}
			debit.set('amount', cents);

			this._super(debit);
		}
	}
});

export default CaptureHoldModalComponent;
