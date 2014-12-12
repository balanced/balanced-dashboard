`import Ember from "ember";`

execute = (callback) ->
	@getModalNotificationController().clearAlerts()
	@set("isSaving", true)
	callback
		.then(successHandler(@), errorHandler(@))
		.finally =>
			@set("isSaving", false)

successHandler = (view) ->
	notificationsController = view.getModalNotificationController()
	(model) ->
		view.close()
		Ember.RSVP.resolve(model)

errorHandler = (view) ->
	notificationsController = view.getModalNotificationController()
	(model) ->
		errors = Ember.A(model.get("errors._root"))
		errors.forEach (message) ->
			notificationsController.alertError(message)
		Ember.RSVP.reject(model)

ObjectActionMixin = Ember.Mixin.create(
	isSaving: false
	delete: (model) ->
		execute =>
			model.delete()

	save: (model) ->
		execute =>
			model.save()
)

`export default ObjectActionMixin;`
