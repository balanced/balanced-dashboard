`import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger";`
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
		mp = @get("marketplace")
		@trackEvent "Marketplace created", mp.getDebuggingProperties()
		@trackEvent "Creating marketplace application", mp.getDebuggingProperties()

		store = @container.lookup("store:balanced")
		mpApplication = store.build("marketplace-application")
		mpApplication.ingestUser @getUser()
		mpApplication.ingestMarketplace @get("model")
		mpApplication.ingestApiKey @get("apiKey")

		mpApplication.save()
			.then =>
				@trackEvent "Gandalf application created", mpApplication.getDebuggingProperties()
				@close()
				@getNotificationController()
					.alertSuccess("Marketplace application created id: #{mpApplication.get("href")}", name: "marketplace-application-success")
			.finally =>
				@set("isSaving", false)

	linkMarketplaceToUser: ->
		mp = @get("marketplace")

		@trackEvent "Marketplace created", mp.getDebuggingProperties()
		@trackEvent "Linking marketplace to user", mp.getDebuggingProperties()

		@container
			.lookup("controller:register-flow/user-marketplace")
			.addApiKeyToCurrentUserFlow(@get("apiKey.secret"))
			.then =>
				@trackEvent "Marketplace linked to user", mp.getDebuggingProperties()
				@close()

	onModelSaved: (model) ->
		@createMarketplaceApplication()
		# @linkMarketplaceToUser()

	model: Ember.computed.reads("marketplace").readOnly()

	actions:
		save: ->
			mp = @get("marketplace")
			@trackEvent "User creating marketplace", mp.getDebuggingProperties()
			@save mp
)

`export default MarketplaceCreateView;`
