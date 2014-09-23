import BaseFundingInstrumentModalView from "./base-funding-instrument-modal";
import Hold from "balanced-dashboard/models/hold";

var HoldCardModalView = BaseFundingInstrumentModalView.extend({
	templateName: 'modals/hold-card',
	controllerEventName: 'openHoldCardModal',
	modalElement: '#hold-card',

	open: function() {
		var hold = Hold.create({
			uri: this.get('funding_instrument.card_holds_uri'),
			source_uri: this.get('funding_instrument.uri'),
			amount: null
		});

		this._super(hold);
	}
});

export default HoldCardModalView;
