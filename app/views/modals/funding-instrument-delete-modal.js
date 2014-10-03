import Ember from "ember";
import ModalBaseView from "./modal-base";
import DeleteMixin from "balanced-dashboard/views/modals/mixins/object-action-mixin";

var FundingInstrumentDeleteModalView = ModalBaseView.extend(DeleteMixin, {
	templateName: "modals/funding-instrument-delete-modal",
	elementId: "delete-funding-instrument",
	isCard: Ember.computed.equal("fundingInstrument.type_name", "card"),
	classNames: ["wide-modal"],
	title: function() {
		return this.get("isCard") ?
			"Remove card" :
			"Remove bank account";
	}.property("isCard"),

	description: function() {
		return this.get("isCard") ?
			"Are you sure you want to remove this card?" :
			"Are you sure you want to remove this bank account?";
	}.property("isCard"),

	isSaving: false,
	actions: {
		save: function(model) {
			this.delete(model);
		}
	}
});

FundingInstrumentDeleteModalView.reopenClass({
	open: function(fundingInstrument) {
		return this.create({
			fundingInstrument: fundingInstrument
		});
	},
});

export default FundingInstrumentDeleteModalView;
