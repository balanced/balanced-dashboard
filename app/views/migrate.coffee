`import Ember from "ember";`

View = Ember.View.extend
	layoutName: 'clean-page-layout'
	pageTitle: 'Migrate'

	model: Ember.computed ->
		Ember.Object.create(
			marketplace: @get("marketplaces.0")
		)

	isMarketplaceValid: Ember.computed "model.marketplace", ->
		!Ember.isBlank(@get("model.marketplace"))

	isTermsValid: Ember.computed "model.isAcceptsTerms", ->
		@get("model.isAcceptsTerms") == true

	isEmailValid: Ember.computed "model.emailAddress", ->
		!Ember.isBlank(@get("model.emailAddress"))

	isSubmitValid: Ember.computed "isMarketplaceValid", "isTermsValid", "isEmailValid", ->
		["isMarketplaceValid", "isTermsValid", "isEmailValid"].every (prop) =>
			@get(prop)

`export default View;`
