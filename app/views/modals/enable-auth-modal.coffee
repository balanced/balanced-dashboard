`import ModalBaseView from "./modal-base";`
`import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";`
`import Full from "./mixins/full-modal-mixin";`
`import Auth from "balanced-dashboard/auth";`

EnableAuthModalView = ModalBaseView.extend Full, Form,
	title: "Enable two-factor authentication"
	description: "Two-factor authentication adds another layer of security to your dashboard account. In addition to your login email and password, you'll need to enter an authentication code from Balanced using your Google Authenticator app on your smartphone."
	elementId: "enable-auth"
	templateName: "modals/enable-auth-modal"
	cancelButtonText: "Cancel"
	submitButtonText: "Enable"
	auth_code_confirm: null,

	didInsertElement: ->
		QR_CODE_URL = '//cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js'
		Auth.enableMultiFactorAuthentication()
			.then ->
				$.getScript(QR_CODE_URL)
			.then =>
				otpSecret = Auth.get('OTPSecret')
				if $.fn.qrcode
					@$('#qrcode').qrcode(otpSecret.secret_uri)

	model: (->
		model = @get("container").lookup("model:otp-login")
		model
	).property()

	isSubmitting: false
	actions:
		save: ->
			model = @get("model")
			model.set("path", Auth.get("lastLoginUri"))

			successCallback = =>
				Auth.get("user").reload()
				@$('#qrcode').empty()
				model.set("otpCode", null)
				@getNotificationController().alertSuccess('Two-factor authentication is enabled.')
				@close()

			errorCallback = (response) =>
				controller = @getModalNotificationController()
				controller.clearAlerts()
				model.set("otpCode", null)
				model.get("validationErrors.fullMessages").forEach (message) ->
					controller.alertError(message)

			@set("isSubmitting", true)
			model.save()
				.then(successCallback, errorCallback)
				.finally =>
					@set('isSubmitting', false)

`export default EnableAuthModalView;`
