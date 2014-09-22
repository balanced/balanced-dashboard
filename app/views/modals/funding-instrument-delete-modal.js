import DeleteMixin from "balanced-dashboard/views/modals/mixins/object-action-mixin";

Balanced.FundingInstrumentDeleteModalView = Balanced.ModalBaseView.extend(DeleteMixin, {
	templateName: "modals/funding_instrument_delete_modal",
	isCard: Ember.computed.equal("fundingInstrument.type_name", "card"),

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

Balanced.FundingInstrumentDeleteModalView.reopenClass({
	open: function(fundingInstrument) {
		return this.create({
			fundingInstrument: fundingInstrument
		});
	},
});
