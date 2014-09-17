`import Ember from 'ember';`
`import Resolver from 'ember/resolver';`
`import loadInitializers from 'ember/load-initializers';`

Ember.MODEL_FACTORY_INJECTIONS = true

App = Ember.Application.extend
	modulePrefix: 'balanced-dashboard'
	Resolver: Resolver

	LOG_TRANSITIONS: false,
	customEvents:
		changeDate: 'changeDate'

	ready: ->
		$('#balanced-loading').remove()

window.Balanced = App.create(window.BALANCED_ENV.APP)
require("balanced-dashboard/manifest")

loadInitializers(App, 'balanced-dashboard')
