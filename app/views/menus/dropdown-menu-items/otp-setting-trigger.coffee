`import OpenModalView from "./open-modal";`

OtpSettingTriggerView = OpenModalView.extend(
	isOtpEnabled: Ember.computed.reads("auth.user.otp_enabled")
	auth: (->
		return @get("container").lookup("auth:main")
	).property()

	modalName: (->
		if @get("isOtpEnabled")
			return "modals/disable-auth-modal"
		else
			return "modals/enable-auth-modal"
	).property("isOtpEnabled")

	text: (->
		if @get("isOtpEnabled")
			return "Disable two-factor authentication"
		else
			return "Enable two-factor authentication"
	).property("isOtpEnabled")
)

`export default OtpSettingTriggerView;`
