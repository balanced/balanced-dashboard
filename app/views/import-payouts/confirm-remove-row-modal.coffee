`import Ember from "ember";`
`import ModalBaseView from "../modals/modal-base";`

ConfirmRemoveRowModal = ModalBaseView.extend(
	title: "Remove Entry"
	elementId: "confirm-remove-row"

	templateName: "import-payouts/confirm-remove-row-modal"

	cancelButtonText: "Cancel"
	submitButtonText: "Remove"

	actions:
		confirm: ->
			row = @get("row")
			controller = @get("container").lookup("controller:marketplace/import-payouts")
			controller.send("removeCreditCreator", row)
			@close()
)

ConfirmRemoveRowModal.reopenClass(
	open: (row) ->
		@create(row: row)
)

`export default ConfirmRemoveRowModal;`
