var Save = Balanced.Modals.ObjectActionMixin;
var Wide = Balanced.Modals.WideModalMixin;

Balanced.Modals.MarketplaceEditModalView = Balanced.ModalBaseView.extend(Save, Wide, {
	templateName: 'modals/marketplace_edit_modal',
	elementId: "edit-marketplace-info",
	title: "Edit marketplace information",

	model: function() {
		// operate on a copy so we don't mess up the original object
		var marketplace = Ember.copy(this.get('marketplace'), true);
		marketplace.set('isNew', false);
		return marketplace;
	}.property("marketplace"),

	actions: {
		save: function() {
			var marketplace = this.get("marketplace");
			this.save(this.get("model"))
				.then(function(model) {
					marketplace.reload();
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
