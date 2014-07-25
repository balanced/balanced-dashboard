Balanced.ChangeFundingSourceModalView = Balanced.ModalBaseView.extend({
	templateName: 'modals/change_funding_source_modal',
	title: 'Change default payment method',
	elementId: 'change-funding-source',
	classNameBindings: [":wide-modal", ":modal-overflow"],
	submitAction: false,

	model: function() {
		// operate on a copy so we don't mess up the original object
		var invoice = Ember.copy(this.get('invoice'), true);
		invoice.setProperties({
			isNew: false,
		});
		return invoice;
	}.property("invoice"),

	sourceId: function(a, value) {
		if (arguments.length > 1) {
			var source = this.get("marketplace.owner_customer.bank_accounts").findBy("id", value);
			this.get("model").setProperties({
				source_uri: source && source.get("uri"),
				source: source
			});
		}
		return this.get("model.source.id");
	}.property("model.source.id"),
	sourceBankAccountName: Ember.computed.oneWay("model.source.name"),
	sourceBankName: Ember.computed.oneWay("model.source.bank_name"),
	source: function() {
		var sourceUri = this.get("source_uri");
		console.log(sourceUri);
		return this.get("debitable_bank_accounts").findBy("uri", sourceUri);
	}.property("source_uri"),

	debitable_bank_accounts: Ember.computed.filterBy("marketplace.owner_customer.bank_accounts", "can_debit"),

	isSaving: false,
	actions: {
		save: function() {
			var self = this;
			var invoice = this.get('model');
			self.set("isSaving", true);
			invoice
				.save()
				.then(function(model) {
					self.set("isSaving", false);
					self.close();
				}, function(errors) {
					self.set("isSaving", false);
				});
		}
	}
});

Balanced.ChangeFundingSourceModalView.reopenClass({
	open: function(invoice, marketplace) {
		var view = this.create({
			invoice: invoice,
			marketplace: marketplace
		});

		return view;
	}
});
