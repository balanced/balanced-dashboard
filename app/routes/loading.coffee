LoadingRoute = Balanced.Route.extend
	deactivate: ->
		timer = @get('timer')
		if timer
			Ember.run.cancel(timer)

	renderTemplate: (controller, model) ->
		# Only render the loading indicator after 0.25s
		timer = Ember.run.later this =>
			@render('loading')
		@set('timer', timer)

`export default LoadingRoute`
