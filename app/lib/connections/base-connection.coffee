`import Ember from "ember";`

BaseConnection = Ember.Object.extend
	# This function can be overriden by descendant classes so they can add default arguments
	settings: (settings) ->
		settings

	post: (url, data) ->
		@ajax(
			url: url
			data: data
			type: "POST"
		)

	delete: (url) ->
		@ajax(
			url: url
			type: "DELETE"
		)

	ajax: (settings) ->
		Adapter = BalancedApp.__container__.lookup("adapter:main")
		Adapter.load(@settings(settings))

`export default BaseConnection;`
