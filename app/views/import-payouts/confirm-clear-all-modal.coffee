`import Ember from "ember";`
`import ModalBaseView from "../modals/modal-base";`

ConfirmClearAllModal = ModalBaseView.extend(
	title: "Clear all entries"
	elementId: "confirm-clear-all"

	templateName: "import-payouts/confirm-clear-all-modal"

	cancelButtonText: "Cancel"
	submitButtonText: "Clear"

	actions:
		confirm: ->
			controller = @get("container").lookup("controller:marketplace/import-payouts")
			controller.send("clearAll")
			@close()
)

`export default ConfirmClearAllModal;`
