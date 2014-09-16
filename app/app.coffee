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

	onLoad: ->
		# initialize anything that needs to be done on application load
$ ->
	Balanced.NET.loadCSRFTokenIfNotLoaded()
		.then ->
			Balanced.Auth.getCurrentLogin()
		.finally ->
			Balanced.advanceReadiness()

window.Balanced = App.create(window.BALANCED_ENV.APP)
require("balanced-dashboard/manifest")

loadInitializers(App, 'balanced-dashboard')
