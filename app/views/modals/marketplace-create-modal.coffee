`import ModalBaseView from "./modal-base";`
`import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";`
`import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";`
`import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";`

MarketplaceCreateView = ModalBaseView.extend(Full, Form, Save,
	templateName: "modals/marketplace-create"
	title: "Enter marketplace information"
	subtitle: "Submit your business and use case information. Balanced will notify you of your approval status via email within two business days. Balanced reserves the right to change product, terms and acceptable use cases prior to approval."

	isMarketplaceApplicationProcess: false

	getUser: ->
		@container.lookup("auth:main").get("user")

	createMarketplaceApplication: ->
		store = @container.lookup("store:balanced")

		mpApplication = store.build("marketplace-application")
		mpApplication.ingestUser @getUser()
		mpApplication.ingestMarketplace @get("model")
		mpApplication.ingestApiKey @get("apiKey")
		mpApplication.save()

	linkMarketplaceToUser: ->
		apiKey = @get("apiKey")
		controller = @container.lookup("controller:modals-container")
		Marketplace = @container.lookupFactory("model:marketplace")

		@getUser().addSecret(apiKey.get("secret"))
			.then (marketplaceHref) =>
				Marketplace.find(marketplaceHref)
			.then (marketplace) =>
				@close()
				modal = "register-flow/marketplace-bank-account-create-modal"
				controller.open(modal, [{
					marketplace: marketplace
					apiKey: apiKey
				}])

	onModelSaved: (model) ->
		# @createMarketplaceApplication()
		@linkMarketplaceToUser()

	model: Ember.computed.reads("marketplace").readOnly()

	actions:
		save: ->
			@save @get("marketplace")
)

`export default MarketplaceCreateView;`
