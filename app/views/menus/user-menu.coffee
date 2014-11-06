`import BaseMenuView from "./base-menu";`

UserMenuView = BaseMenuView.extend(
	elementId: "user-menu"
	templateName: "menus/user-menu"

	isGuest: Ember.computed.reads("auth.isGuest")
	isAdmin: Ember.computed.reads("auth.isAdmin")
	isOtpEnabled: Ember.computed.reads("auth.user.otp_enabled")

	auth: (->
		return @get("container").lookup("auth:main")
	).property()

	iconName: "icon-customers",
	menuTitle: (->
		if @get("auth.isGuest")
			return "Guest user"
		else
			return @get("auth.user.email_address")
	).property("auth.isGuest", "auth.user.email_address")

	administratorLinks: (->
		@constructor.administratorLinks
	).property()
)

UserMenuView.reopenClass(
	administratorLinks: []
	addAdministratorLink: (klass, attributes) ->
		@administratorLinks.addObject klass.extend(attributes)
)

`export default UserMenuView;`
