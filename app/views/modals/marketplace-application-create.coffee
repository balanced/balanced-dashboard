`import ModalBaseView from "./modal-base";`
`import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";`
`import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";`
`import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";`

selectItem = (label, value) ->
	value = value || label.toLowerCase()
	label: label
	value: value

MarketplaceApplicationCreateView = ModalBaseView.extend(Full, Form, Save,
	templateName: "modals/marketplace-application-create"
	title: "Apply for production access"
	subtitle: "Submit your business and use case information. Balanced will notify you of your approval status via email within two business days. Balanced reserves the right to change product, terms and acceptable use cases prior to approval."

	isBusiness: Ember.computed.reads("model.isBusiness").readOnly()
	model: Ember.computed(->
		store = @container.lookupFactory("store:balanced").create()
		store.build("api-key-production")
	).readOnly()

	marketplaceCategories: [
		selectItem("Goods/services", "goods_services")
		selectItem("Crowdfunding")
		selectItem("Donations")
		selectItem("E-commerce", "ecommerce")
		selectItem("Other (specify)", "other")
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
		@close()
		marketplace = model.getStore().build("marketplace", name: "Cool")

		controller = @container.lookup("controller:modals-container")
		controller.open("modals/marketplace-create-modal", [{
			marketplace: marketplace
			apiKey: model
		}])

	actions:
		save: ->
			@save @get("model")
)

`export default MarketplaceApplicationCreateView;`
