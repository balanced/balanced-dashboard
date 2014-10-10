import BaseFundingInstrumentModalView from "./base-funding-instrument-modal";
import CaptureHoldTransactionFactory from "balanced-dashboard/models/factories/capture-hold-transaction-factory";

var CaptureHoldModalView = BaseFundingInstrumentModalView.extend({
	templateName: 'modals/capture-hold-modal',
	elementId: 'capture-hold',
	title: "Capture this hold",
	cancelButtonText: "Cancel",
	submitButtonText: "Capture"
});

CaptureHoldModalView.reopenClass({
	open: function(hold) {
		var debit = CaptureHoldTransactionFactory.create({
			hold: hold,
			dollar_amount: hold.get("amount_dollars")
		});

		return this.create({
			model: debit
		});
	},
});

export default CaptureHoldModalView;
