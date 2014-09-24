`import Ember from 'ember';`
`import Resolver from 'ember/resolver';`
`import loadInitializers from 'ember/load-initializers';`
`import ENV from "balanced-dashboard/config/environment";`

window.BALANCED_ENV = window.ENV = ENV
window.EMBER_ENV = window.BALANCED_ENV.EmberENV

Ember.MODEL_FACTORY_INJECTIONS = true
Ember.deprecate = ->

App = Ember.Application.extend
	modulePrefix: 'balanced-dashboard'

	rootElement: "#balanced-app"

	Resolver: Resolver

	customEvents:
		changeDate: 'changeDate'

	ready: ->
		$('#balanced-loading').remove()

loadInitializers(App, 'balanced-dashboard')

`export default App;`
