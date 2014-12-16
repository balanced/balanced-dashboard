import Ember from "ember";
import actionEvented from "../mixins/action-evented";

var actionsMixin = actionEvented('openDeleteModal');

var MarketplaceSettingsController = Ember.ObjectController.extend(actionsMixin, {
	needs: ["marketplace"],

	can_edit: Ember.computed.alias('production'),

	ownerCustomer: Ember.computed.oneWay("marketplace.owner_customer"),

	fundingInstrumentsResultsLoader: function() {
		if (this.get("owner_customer")) {
			return this.get("owner_customer").getFundingInstrumentsLoader({
				limit: 10
			});
		} else {
			return this.get("container").lookup("results-loader:base");
		}
	}.property("owner_customer"),

	userMarketplace: function() {
		var user = this.get('user');
		var currentUserMarketplace = user.user_marketplace_for_id(this.get('id'));
		return currentUserMarketplace;
	}.property('user', 'id'),

	marketplaceSecret: Ember.computed.reads("userMarketplace.secret"),

	actions: {
		changePaymentMethodFilter: function(method) {
			this.set("fundingInstrumentsResultsLoader.type", method);
		},

		reloadApiKeys: function() {
			this.get("userMarketplace.marketplaceApiKeys").reload();
		},

		reloadUsers: function() {
			this.get("userMarketplace").reloadMarketplaceUsers();
		},
	}
});

export default MarketplaceSettingsController;
