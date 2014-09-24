import ModalView from "../modals/modal";
import Utils from "balanced-dashboard/lib/utils";

var BaseFundingInstrumentModalView = ModalView.extend({
	dollar_amount: null,

	open: function(model) {
		this.set('dollar_amount', null);
		this._super(model);
	},

	beforeSave: function(model) {
		var cents = null;

		model.setProperties({
			validationErrors: undefined,
			isValid: true
		});

		try {
			cents = Utils.dollarsToCents(this.get('dollar_amount'));
		} catch (error) {
			model.setProperties({
				validationErrors: {
					amount: error
				},
				isValid: false
			});

			return false;
		}

		model.set('amount', cents);
		return true;
	},

	afterSave: function(model) {
		this.get('controller').transitionToRoute(model.get('route_name'), model);
	}
});

export default BaseFundingInstrumentModalView;
