import BaseFundingInstrumentModalView from "./base-funding-instrument-modal";
import Credit from "balanced-dashboard/models/credit";

var CreditFundingInstrumentModalView = BaseFundingInstrumentModalView.extend({
	templateName: 'modals/credit-funding-instrument',
	controllerEventName: 'openCreditFundingInstrumentModal',
	modalElement: '#credit-funding-instrument',

	open: function() {
		var credit = Credit.create({
			uri: this.get('funding_instrument.credits_uri'),
			source_uri: this.get('funding_instrument.uri'),
			amount: null
		});

		this._super(credit);
	}
});

export default CreditFundingInstrumentModalView;
