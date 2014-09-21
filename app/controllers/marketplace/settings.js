import Ember from "ember";

var actionsMixin = Balanced.ActionEvented('openDeleteModal', 'openDeleteCallbackModal');
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
			return Balanced.ResultsLoader.create();
		}
	}.property("owner_customer"),

	userMarketplace: function() {
		var user = this.get('user');
		var currentUserMarketplace = user.user_marketplace_for_id(this.get('id'));
		return currentUserMarketplace;
	}.property('user', 'id'),

	marketplaceSecret: function() {
		return this.get('userMarketplace.secret') || '';
	}.property('userMarketplace', 'userMarketplace.secret')
});

export default MarketplaceSettingsController;
