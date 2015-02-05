`import Ember from "ember";`

getRootErrorMessages = (model) ->
	messages = model.get("errors._root") || model.get("validationErrors.messages")
	Ember.A(messages)

ObjectActionMixin = Ember.Mixin.create(
	isSaving: false

	onModelSaved: (model) ->
		@close()
		Ember.RSVP.resolve(model)

	executeAction: (callback) ->
		notificationsController = @getModalNotificationController()
		if notificationsController
			notificationsController.clearAlerts()

		successHandler = (model) =>
			successAlertText = @get("successAlertText")
			if !Ember.isBlank(successAlertText)
				@getNotificationController().alertSuccess successAlertText
			@onModelSaved(model)

		errorHandler = (model) ->
			console.log "errorHandler", model
			if !Ember.isBlank(model)
				getRootErrorMessages(model).forEach (message) ->
					notificationsController.alertError(message)
				return Ember.RSVP.reject(model)
			else
				return Ember.RSVP.reject()


		@set("isSaving", true)
		return callback()
			.then(successHandler, errorHandler)
			.finally(=> @set("isSaving", false))

	delete: (model) ->
		@executeAction ->
			return model.delete()

	save: (model) ->
		@executeAction ->
			if model.get("validationErrors")
				model.get("validationErrors").clear()
			return model.save()
)

`export default ObjectActionMixin;`
