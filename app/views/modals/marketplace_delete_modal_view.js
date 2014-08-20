var DeleteMixin = Balanced.Modals.ObjectActionMixin;

Balanced.Modals.MarketplaceDeleteModalView = Balanced.ModalBaseView.extend(DeleteMixin, {
	templateName: 'modals/marketplace_delete_modal',
	title: "Remove marketplace?",
	elementId: "delete-marketplace",

	getUserMarketplace: function() {
		var marketplacesUri = this.get("user.marketplaces_uri");
		var marketplaceId = this.get("marketplace.id");
		var uri = Balanced.Utils.combineUri(marketplacesUri, marketplaceId);
		return Balanced.UserMarketplace.create({
			uri: uri,
			isLoaded: true
		});
	},

	actions: {
		save: function() {
			var user = this.get("user");
			var model = this.getUserMarketplace();
			this.delete(model)
				.then(function() {
					user.reload();
				});
		}
	}
});

Balanced.Modals.MarketplaceDeleteModalView.reopenClass({
	open: function(user, marketplace) {
		return this.create({
			marketplace: marketplace,
			user: user,
		});
	}
});
