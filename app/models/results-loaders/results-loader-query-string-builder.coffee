isSerializableDate = (value) ->
	_.isDate(value) || moment.isMoment(value)

class ResultsLoaderQueryStringBuilder
	constructor: ->
		@queryStringAttributes = {}

	addValues: (object) ->
		_.each object, (value, key) =>
			@addValue(key, value)
		@

	addValue: (key, value) ->
		if Ember.isArray(value)
			if (value.length == 1)
				@queryStringAttributes[key] = value[0]
			else if (value.length > 1)
				@queryStringAttributes["#{key}[in]"] = value.join(",")
		else if (isSerializableDate(value))
			@queryStringAttributes[key] = value.toISOString()
		else if (!Ember.isBlank(value))
			@queryStringAttributes[key] = value

	getQueryStringAttributes: ->
		@queryStringAttributes

`export default ResultsLoaderQueryStringBuilder;`
