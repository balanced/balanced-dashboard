BaseAdapter = Ember.Object.extend
	init: ->
		if @initAdapter
			@initAdapter()

	get: (type, uri, success, error) ->
		Ember.assert("Your adapter should override get", false)

	create: (type, uri, data, success, error) ->
		Ember.assert("Your adapter should override create", false)

	update: (type, uri, data, success, error) ->
		Ember.assert("Your adapter should override update", false)

	delete: (type, uri, success, error) ->
		Ember.assert("Your adapter should override delete", false)

	_checkParams: (type, uri) ->
		if !uri
			throw new Error('Missing URI in adapter call for %@'.fmt(type))

		if !type
			throw new Error('Missing type in adapter call for %@'.fmt(uri))

`export default BaseAdapter`
