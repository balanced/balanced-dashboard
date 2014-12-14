`import Ember from "ember";`

ObjectActionMixin = Ember.Mixin.create(
	isSaving: false

	executeAction: (callback) ->
		notificationsController = @getModalNotificationController()
		notificationsController.clearAlerts()

		successHandler = (model) =>
			successAlertText = @get("successAlertText")
			if !Ember.isBlank(successAlertText)
				@getNotificationController().alertSuccess(successAlertText)

			if Ember.typeOf(@onModelSaved) == "function"
				@onModelSaved(model)

			@close()
			Ember.RSVP.resolve(model)

		errorHandler = (model) ->
			errors = Ember.A(model.get("errors._root"))
			errors.forEach (message) ->
				notificationsController.alertError(message)
			Ember.RSVP.reject(model)

		@set("isSaving", true)
		callback()
			.then(successHandler, errorHandler)
			.finally(=> @set("isSaving", false))

	delete: (model) ->
		@executeAction(=> model.delete())

	save: (model) ->
		@executeAction(=> model.save())
)

`export default ObjectActionMixin;`
