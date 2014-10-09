import BaseFundingInstrumentModalView from "./base-funding-instrument-modal";
import HoldExistingFundingInstrumentTransactionFactory from "balanced-dashboard/models/factories/hold-existing-funding-instrument-transaction-factory";

var HoldCardModalView = BaseFundingInstrumentModalView.extend({
	templateName: 'modals/hold-card-modal',
	elementId: 'hold-card',
	title: "Hold this card",
	cancelButtonText: "Cancel",
	submitButtonText: "Hold",
});

HoldCardModalView.reopenClass({
	open: function(card) {
		var hold = HoldExistingFundingInstrumentTransactionFactory.create({
			source: card
		});
		return this.create({
			model: hold
		});
	},
});

export default HoldCardModalView;
