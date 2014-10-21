`import Ember from "ember";`

Session = Ember.Object.extend()

Session.reopenClass(
	fromJsonResponse: (response) =>
		user = @get("container").lookup("model:user")
		user.populateFromJsonResponse(response)
		@create(
			user: user
			userId: response.user_id
			admin: response.admin
			uri: response.uri
			isGuest: false
		)
)

`export default Session;`
