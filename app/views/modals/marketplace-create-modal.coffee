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
		mpApplication.save().then =>
			@close()
			@get("container")
				.lookup("controller:application")
				.transitionToRoute("marketplace-application", mpApplication)

	linkMarketplaceToUser: ->
		apiKey = @get("apiKey")
		store = apiKey.getStore()
		controller = @container.lookup("controller:modals-container")
		Marketplace = @container.lookupFactory("model:marketplace")

		@container
			.lookup("controller:register-flow/user-marketplace")
			.addApiKeyToCurrentUserFlow(apiKey.get("secret"))
		@close()

	onModelSaved: (model) ->
		# @createMarketplaceApplication()
		@linkMarketplaceToUser()

	model: Ember.computed.reads("marketplace").readOnly()

	actions:
		save: ->
			@save @get("marketplace")
)

`export default MarketplaceCreateView;`
