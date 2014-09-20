import Ember from "ember";

var MarketplaceLinkBarView = Ember.View.extend({
	tagName: "li",
	templateName: "marketplaces/marketplace-link-bar",
	isProduction: Ember.computed.oneWay("marketplace.production"),
	isTest: Ember.computed.not("isProduction"),
	classNameBindings: [":mp-production", "isProduction:mp-production:mp-test"],
});

export default MarketplaceLinkBarView;
