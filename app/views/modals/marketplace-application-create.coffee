`import ModalBaseView from "./modal-base";`
`import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";`
`import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";`
`import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";`

selectItem = (label, value) ->
	value = value || label.toLowerCase()
	label: label
	value: value

MarketplaceApplicationCreateView = ModalBaseView.extend(Full, Form, Save,
	elementId: "apiKeyCreate"
	templateName: "modals/marketplace-application-create"
	title: "Apply for production access"

	description: Ember.computed(->
		if BalancedApp.USE_MARKETPLACE_APPLICATION
			"Submit your business and use case information. Balanced will notify you of your approval status via email within two business days. Balanced reserves the right to change product, terms and acceptable use cases prior to approval."
		else
			"Submit your business and use case information. Balanced reserves the right to change product, terms and acceptable use cases prior to approval."
	)
	subtitle: "Step 1: Provide business information"
	prohibitedBusinessesLink: "https://support.balancedpayments.com/hc/en-us/articles/201863174-What-businesses-are-prohibited-from-using-Balanced-"

	isBusiness: Ember.computed.reads("model.isBusiness").readOnly()
	model: Ember.computed(->
		store = @container.lookupFactory("store:balanced").create()
		store.build("api-key-production")
	).readOnly()

	marketplaceCategories: [
		selectItem("Goods/Services", "goods_services")
		selectItem("Crowdfunding")
		selectItem("Donations")
		selectItem("E-commerce", "ecommerce")
		selectItem("Other", "other")
	]

	companyTypes: [
		selectItem("Business: LLC", "llc")
		selectItem("Business: S-Corp", "scorp")
		selectItem("Business: C-Corp", "ccorp")
		selectItem("Business: Partnership", "partnership")
		selectItem("Business: Sole proprietorship", "sole_proprietorship")
		selectItem("Individual", "person")
	]

	onModelSaved: (model) ->
		@trackEvent "Api key created", model.getDebuggingProperties()
		@close()

		marketplace = model.getStore().build("marketplace")
		@openModal("modals/marketplace-create-modal",
			marketplace: marketplace
			apiKey: model
		)

		@getModalNotificationController().alertSuccess("Business information confirmed")

	actions:
		save: ->
			model = @get("model")
			@trackEvent "Creating api key", model.getDebuggingProperties()
			@save model
)

`export default MarketplaceApplicationCreateView;`
