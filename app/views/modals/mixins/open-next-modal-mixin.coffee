`import Ember from "ember";`

OpenNextModalMixin = Ember.Mixin.create(
	openNext: ->
		applicationController = @get("container").lookup("controller:application")
		args = _.toArray(arguments)
		args.unshift("openModal")
		applicationController.send.apply(applicationController, args)

	openInstance: (instance) ->
		@get("container")
			.lookup("controller:modals-container")
			.openInstance(instance)
)

`export default OpenNextModalMixin;`
