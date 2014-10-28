`import ModalBaseView from "../modals/modal-base";`
`import FullModalMixin from "../modals/mixins/full-modal-mixin";`
`import OpenNextModalMixin from "../modals/mixins/open-next-modal-mixin";`

ConfirmCloseRegistrationModalView = ModalBaseView.extend(FullModalMixin, OpenNextModalMixin,
	layoutName: null
	templateName: "register-flow/confirm-close-registration-modal"
	staticBackdrop: true
	title: "Cancel registration?"
	submitButtonText: "Cancel registration"
	cancelButtonText: "Resume"
	actions:
		retry: ->
			modalsController = @get("container").lookup("controller:modals-container")
			modalsController.close()
			modalsController.openInstance @get("previousModal")
)

`export default ConfirmCloseRegistrationModalView;`
