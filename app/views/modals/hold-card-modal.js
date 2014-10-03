import BaseFundingInstrumentModalView from "./base-funding-instrument-modal";
import HoldExistingFundingInstrumentTransactionFactory from "balanced-dashboard/models/factories/hold-existing-funding-instrument-transaction-factory";
import Hold from "balanced-dashboard/models/hold";

var HoldCardModalView = BaseFundingInstrumentModalView.extend({
	templateName: 'modals/hold-card',
	elementId: '#hold-card',
	title: "Hold this card",
	cancelButtonText: "Cancel",
	submitButtonText: "Hold",
});

HoldCardModalView.reopenClass({
	open: function(card) {
		var hold = HoldExistingFundingInstrumentTransactionFactory.create({
			source: card
		});
		console.log(HoldExistingFundingInstrumentTransactionFactory, card)
		return this.create({
			model: hold
		});
	},
});

export default HoldCardModalView;
