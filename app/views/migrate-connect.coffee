`import Ember from "ember";`

View = Ember.View.extend
	layoutName: 'clean-page-layout'
	pageTitle: 'Connect to your Stripe account'

	marketplace: Ember.computed.reads("controller.model")
	marketplaceId: Ember.computed.reads("marketplace.id")

	stripeApplicationId: Ember.computed "marketplace.test", ->
		if @get("marketplace.test")
			"ca_5dvMyNcFzpYybDusO7oTdnS4dfErebB1"
		else
			"ca_5dvMPc8m1N5R2EkNElwKsJvQ8VdRdcaN"

	activateAccountHref: Ember.computed "stripeApplicationId", "marketplaceId",  ->
		applicationId = @get("stripeApplicationId")
		marketplaceId = @get("marketplaceId")
		"https://connect.stripe.com/oauth/authorize?response_type=code&client_id=#{applicationId}&scope=read_write&state=#{marketplaceId}"

`export default View;`
