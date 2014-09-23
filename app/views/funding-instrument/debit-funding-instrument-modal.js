import BaseFundingInstrumentModalView from "./base-funding-instrument-modal";
import Debit from "balanced-dashboard/models/debit";

var DebitFundingInstrumentModalView = BaseFundingInstrumentModalView.extend({
	templateName: 'modals/debit-funding-instrument',
	controllerEventName: 'openDebitFundingInstrumentModal',
	modalElement: '#debit-funding-instrument',

	open: function() {
		var debit = Debit.create({
			uri: this.get('funding_instrument.debits_uri'),
			source_uri: this.get('funding_instrument.uri'),
			amount: null
		});

		this._super(debit);
	}
});

export default DebitFundingInstrumentModalView;
