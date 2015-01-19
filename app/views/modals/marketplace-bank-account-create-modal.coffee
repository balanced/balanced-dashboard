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
	title: "Add a marketplace bank account"

	accountTypes: [
		selectItem("Checking"),
		selectItem("Savings")
	]

	model: Ember.computed.reads("bankAccount").readOnly()

	onModelSaved: (bankAccount) ->
		customerHref = @get("marketplace.owner_customer_uri")
		bankAccount.linkToCustomer(customerHref).then =>
			@close()

	actions:
		save: ->
			@save @get("bankAccount")
)

`export default MarketplaceBankAccountCreateView;`
