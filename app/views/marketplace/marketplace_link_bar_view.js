Balanced.MarketplaceLinkBarView = Balanced.View.extend({
	tagName: "li",
	isProduction: Ember.computed.oneWay("marketplace.production"),
	isTest: Ember.computed.not("isProduction"),
	classNameBindings: [":mp-production", "isProduction:mp-production:mp-test"],
	templateName: "marketplace/marketplace_link_bar",
});
