`import Ember from "ember";`

View = Ember.View.extend
	layoutName: 'clean-page-layout'
	pageTitle: 'Migrate success'

	marketplace: Ember.computed.reads("controller.model")

	stripeApplicationId: Ember.computed "marketplace.test", ->
		if @get("marketplace.test")
			"ca_5dvMyNcFzpYybDusO7oTdnS4dfErebB1"
		else
			"ca_5dvMPc8m1N5R2EkNElwKsJvQ8VdRdcaN"

	stripeAccountId: Ember.computed "marketplace.meta", ->
		@get("marketplace.meta")["stripe.account_id"]

	activateAccountHref: Ember.computed "stripeAccountId", "stripeApplicationId", ->
		accountId = @get("stripeAccountId")
		applicationId = @get("stripeApplicationId")
		"https://dashboard.stripe.com/account/activate?client_id=#{applicationId}&user_id=#{accountId}"

`export default View;`
