`import Ember from "ember";`

BaseConnection = Ember.Object.extend
	# This function should can be overriden by descendant classes so they can
	# add default arguments
	settings: (settings) ->
		settings

	post: (url, data) ->
		@ajax(
			url: url,
			data: data,
			type: "POST"
		)

	ajax: (settings) ->
		BaseConnection.ADAPTER.load @settings(settings)

`export default BaseConnection;`
