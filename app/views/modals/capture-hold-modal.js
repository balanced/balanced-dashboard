import BaseFundingInstrumentModalView from "./base-funding-instrument-modal";

var CaptureHoldModalView = BaseFundingInstrumentModalView.extend({
	templateName: 'modals/capture-card-modal',
	elementId: '#hold-card',
	title: "Capture this hold",
	cancelButtonText: "Cancel",
	submitButtonText: "Capture"
});

CaptureHoldModalView.reopenClass({
	open: function(hold) {
		return this.create({
			model: hold
		});
	},
});

export default CaptureHoldModalView;
