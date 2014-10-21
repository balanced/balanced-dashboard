`import Ember from "ember";`
`import User from "./user";`

Session = Ember.Object.extend()

Session.reopenClass(
	fromJsonResponse: (response) =>
		user = User.create()
		user.populateFromJsonResponse(response.user)
		session = Session.create(
			user: user
			userId: response.user_id
			admin: response.admin
			uri: response.uri
			isGuest: false
		)
		session
)

`export default Session;`
