Balanced.Modals.MarketplaceEditModalView = Balanced.ModalBaseView.extend({
	classNameBindings: [":wide-modal", ":modal-overflow"],
	templateName: 'modals/marketplace_edit_modal',
	elementId: "edit-marketplace-info",
	title: "Edit marketplace information",

	model: function() {
		// operate on a copy so we don't mess up the original object
		var marketplace = Ember.copy(this.get('marketplace'), true);
		marketplace.set('isNew', false);
		return marketplace;
	}.property("marketplace"),

	isSaving: false,
	actions: {
		save: function() {
			var self = this;
			this.set("isSaving", true);
			this.get("model")
				.save()
				.then(function(model) {
					self.get("marketplace").reload();
					self.close();
				}, function(errors) {
					self.set("isSaving", false);
				});
		}
	}
});

Balanced.Modals.MarketplaceEditModalView.reopenClass({
	open: function(marketplace) {
		return this.create({
			marketplace: marketplace
		});
	}
});
