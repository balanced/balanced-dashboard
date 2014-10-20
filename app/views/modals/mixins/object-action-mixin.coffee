`import Ember from "ember";`

ObjectActionMixin = Ember.Mixin.create(
	isSaving: false
	delete: (model) ->
		@set("isSaving", true)
		return model
			.delete()
			.then (savedModel) =>
				@close()
				return Ember.RSVP.resolve(savedModel)
			.finally =>
				@set("isSaving", false)

	save: (model) ->
		@set("isSaving", true)
		return model
			.save()
			.then (savedModel) =>
				@close()
				return Ember.RSVP.resolve(savedModel)
			.finally =>
				@set("isSaving", false)
)

`export default ObjectActionMixin;`
