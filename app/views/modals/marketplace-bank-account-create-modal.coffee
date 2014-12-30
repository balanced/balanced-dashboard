`import ModalBaseView from "./modal-base";`
`import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";`
`import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";`
`import Save from "balanced-dashboard/views/modals/mixins/object-action-mixin";`

selectItem = (label, value) ->
	value = value || label.toLowerCase()
	label: label
	value: value

MarketplaceBankAccountCreateView = ModalBaseView.extend(Full, Form, Save,
	templateName: "modals/marketplace-bank-account-create-modal"
	title: "Register for a production marketplace"

	accountTypes: [
		selectItem("Checking"),
		selectItem("Savings")
	]

	model: Ember.computed.reads("bankAccount").readOnly()

	getLegacyMarketplace: ->
		href = @get("marketplace.href")
		@get("container").lookupFactory("model:marketplace").find(href)

	onModelSaved: (model) ->
		customerHref = @get("marketplace.owner_customer_uri")
		model.linkToCustomer(customerHref)
			.then =>
				@close()
				@get("container")
					.lookup("controller:application")
					.transitionToRoute("marketplace", @getLegacyMarketplace())

	actions:
		save: ->
			@save @get("bankAccount")
)

`export default MarketplaceBankAccountCreateView;`
